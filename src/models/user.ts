import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { PermissionRole } from "./permissionRole.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import type { Request, Response } from "express";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Employee } from "./employee.ts";
import { Settings } from "./settings.ts";
import { EmployeeUnavailabilitySyncService } from "../services/employeeUnavailabilitySyncService.ts";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare studentID: number;
    declare permissionRoleID: number;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phoneNumber: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PermissionRole,
                key: "id",
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "studentID",
                    "permissionRoleID",
                    "firstName",
                    "lastName",
                ],
            },
        ],
    },
);

class UserRouter extends ModelRouter {
    public path(): string {
        return "/users";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) => ScheduleDatabase.create(User, req, res));
        router.put("/", (req, res) => this.updateUser(req, res));
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(User, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(User, req, res, "id"),
        );
        router.get("/", (req, res) => ScheduleDatabase.getAll(User, req, res));
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
