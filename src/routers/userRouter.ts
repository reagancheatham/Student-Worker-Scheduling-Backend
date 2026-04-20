import type { Request, Response } from "express";
import { Router } from "express";
import { adminAuth, userAuth } from "../authentication.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { User } from "../models/user.ts";
import { Business } from "../models/business.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";
import { Employee } from "../models/employee.ts";
import { PermissionRole } from "../models/permissionRole.ts";
import { Settings } from "../models/settings.ts";
import { EmployeeUnavailabilitySyncService } from "../services/employeeUnavailabilitySyncService.ts";

class UserRouter extends ModelRouter {
    public path(): string {
        return "/users";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(User, req, res),
        );
        router.put("/", userAuth(), (req, res) => this.updateUser(req, res));
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(User, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(User, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAllWhere(User, req, res, {
                include: [
                    {
                        model: Employee,
                        include: [
                            Business,
                            {
                                model: BusinessPermissionRole,
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                    {
                        model: PermissionRole,
                        attributes: ["id", "name"],
                    },
                ],
            }),
        );
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        const info = req.body;

        if (!info) {
            res.status(400).send({ message: "User payload is required" });
            return;
        }

        const userID = Number.parseInt(String(info.id ?? ""), 10);

        if (!Number.isInteger(userID) || userID <= 0) {
            res.status(400).send({ message: "id is required and must be a positive integer" });
            return;
        }

        const existingUser = await User.findByPk(userID);
        if (!existingUser) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        try {
            const [affectedCount] = await User.update(info, {
                where: { id: userID },
            });

            if (affectedCount === 0) {
                res.status(200).send({ affectedCount });
                return;
            }

            const updatedUser = await User.findByPk(userID);
            if (!updatedUser) {
                res.status(200).send({ affectedCount });
                return;
            }

            const previousStudentID = existingUser.studentID;
            const nextStudentID = updatedUser.studentID;
            const studentIDWasSet = previousStudentID !== nextStudentID
                && Number.isInteger(nextStudentID)
                && nextStudentID > 0
                && nextStudentID !== 111111;

            if (!studentIDWasSet) {
                res.status(200).send({ affectedCount });
                return;
            }

            const requestTermCode = String(req.body?.termCode ?? "").trim();
            const defaultEnvTermCode = String(
                process.env.STUDENT_SCHEDULE_DEFAULT_TERM_CODE ?? "",
            ).trim();

            const employees = await Employee.findAll({
                where: { userID },
            });
            const businessTermCodeLookup = new Map<number, string>();

            let employeesProcessed = 0;
            let employeesSkipped = 0;
            let employeesSkippedNoTermCode = 0;
            let blocksPrepared = 0;
            let blocksInserted = 0;
            let blocksUpdated = 0;
            let blocksRemoved = 0;

            for (const employee of employees) {
                let termCode = requestTermCode;

                if (!termCode) {
                    let businessDefaultTermCode = businessTermCodeLookup.get(employee.businessID);

                    if (businessDefaultTermCode === undefined) {
                        const businessSettings = await Settings.findByPk(employee.businessID);
                        businessDefaultTermCode = String(
                            businessSettings?.defaultTermCode ?? "",
                        ).trim();
                        businessTermCodeLookup.set(employee.businessID, businessDefaultTermCode);
                    }

                    termCode = businessDefaultTermCode || defaultEnvTermCode;
                }

                if (!termCode) {
                    employeesSkipped += 1;
                    employeesSkippedNoTermCode += 1;
                    continue;
                }

                const syncResult = await EmployeeUnavailabilitySyncService.syncForEmployee(
                    employee.id,
                    {
                        studentID: updatedUser.studentID,
                        email: updatedUser.email,
                    },
                    termCode,
                );

                if (!syncResult) {
                    employeesSkipped += 1;
                    continue;
                }

                employeesProcessed += 1;
                blocksPrepared += syncResult.blocksPrepared;
                blocksInserted += syncResult.blocksInserted;
                blocksUpdated += syncResult.blocksUpdated;
                blocksRemoved += syncResult.blocksRemoved;
            }

            res.status(200).send({
                affectedCount,
                studentIDSyncTriggered: true,
                requestTermCode,
                employeesFound: employees.length,
                employeesProcessed,
                employeesSkipped,
                employeesSkippedNoTermCode,
                blocksPrepared,
                blocksInserted,
                blocksUpdated,
                blocksRemoved,
            });
        } catch (error: any) {
            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = error.errors.map((entry: any) => entry.path);

                res.status(409).send({
                    message: `${fields.join(", ")} must be unique`,
                });
                return;
            }

            console.error(`Error updating User: ${error}`);
            res.status(500).send({ error });
        }
    }
}

export const userRouter = new UserRouter();
