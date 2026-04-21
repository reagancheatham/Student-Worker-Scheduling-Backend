import type { Request, Response } from "express";
import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { EmployeeUnavailability } from "../models/employeeUnavailability.ts";
import { Employee } from "../models/employee.ts";
import { User } from "../models/user.ts";
import { EmployeeUnavailabilitySyncService } from "../services/employeeUnavailabilitySyncService.ts";

class EmployeeUnavailabilityRouter extends ModelRouter {
    public path(): string {
        return "/employeeUnavailabilities";
    }

    protected buildRouter(router: Router): void {
        router.post("/import/studentSchedules", (req, res) => this.importStudentSchedules(req, res));
        router.post("/import/studentSchedules/employee/:employeeID", (req, res) => this.importStudentScheduleForEmployee(req, res));
        router.post("/", (req, res) => ScheduleDatabase.create(EmployeeUnavailability, req, res));
        router.put("/", (req, res) => ScheduleDatabase.update(EmployeeUnavailability, req, res, "id"));
        router.delete("/:id", (req, res) => ScheduleDatabase.delete(EmployeeUnavailability, req, res, "id"));
        router.get("/:id", (req, res) => ScheduleDatabase.get(EmployeeUnavailability, req, res, "id"));
        router.get("/:employeeID", (req, res) => ScheduleDatabase.getAllWhere(EmployeeUnavailability, req, res, {}, "employeeID"));
    }

    private async importStudentSchedules(req: Request, res: Response): Promise<void> {
        const businessID = Number.parseInt(String(req.body?.businessID ?? ""), 10);
        const termCode = String(req.body?.termCode ?? "").trim();

        if (!Number.isInteger(businessID) || businessID <= 0) {
            res.status(400).send({ message: "businessID is required and must be a positive integer" });
            return;
        }

        if (!termCode) {
            res.status(400).send({ message: "termCode is required" });
            return;
        }

        try {
            const employees = await Employee.findAll({
                where: { businessID },
                include: [{ model: User, required: true }],
            });

            let employeesProcessed = 0;
            const employeeErrors: Array<{ employeeID: number; message: string }> = [];

            for (const employee of employees) {
                const user = (employee as Employee & { User?: User }).User;
                if (!user) {
                    continue;
                }

                try {
                    const importResult = await EmployeeUnavailabilitySyncService.syncForEmployee(
                        employee.id,
                        {
                            studentID: user.studentID,
                            email: user.email,
                        },
                        termCode,
                    );

                    if (!importResult) {
                        continue;
                    }

                    employeesProcessed += 1;
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to import student schedule";

                    employeeErrors.push({
                        employeeID: employee.id,
                        message,
                    });
                }
            }

            res.status(200).send({
                businessID,
                termCode,
                employeesProcessed,
                employeeErrors,
            });
        } catch (error) {
            console.error(`Error importing student schedules: ${error}`);
            const message = error instanceof Error ? error.message : "Failed to import student schedules";
            const statusCode =
                message.includes("Student schedule API returned an unsuccessful response") ||
                message.includes("Student schedule API error")
                ? 502
                : 400;

            res.status(statusCode).send({ message, error });
        }
    }

    private async importStudentScheduleForEmployee(req: Request, res: Response): Promise<void> {
        const employeeID = Number.parseInt(String(req.params?.employeeID ?? ""), 10);
        const termCode = String(req.body?.termCode ?? "").trim();

        if (!Number.isInteger(employeeID) || employeeID <= 0) {
            res.status(400).send({ message: "employeeID is required and must be a positive integer" });
            return;
        }

        if (!termCode) {
            res.status(400).send({ message: "termCode is required" });
            return;
        }

        try {
            const employee = await Employee.findOne({
                where: { id: employeeID },
                include: [{ model: User, required: true }],
            });

            if (!employee) {
                res.status(404).send({ message: "Employee not found" });
                return;
            }

            const user = (employee as Employee & { User?: User }).User;
            if (!user) {
                res.status(400).send({ message: "Employee is missing a valid studentID/email for schedule lookup" });
                return;
            }

            const importResult = await EmployeeUnavailabilitySyncService.syncForEmployee(
                employee.id,
                {
                    studentID: user.studentID,
                    email: user.email,
                },
                termCode,
            );

            if (!importResult) {
                res.status(400).send({ message: "Employee is missing a valid studentID/email for schedule lookup" });
                return;
            }

            res.status(200).send({
                employeeID,
                termCode,
                success: true,
            });
        } catch (error) {
            console.error(`Error importing student schedule for employee ${employeeID}: ${error}`);
            const message = error instanceof Error ? error.message : "Failed to import student schedule";
            const statusCode =
                message.includes("Student schedule API returned an unsuccessful response") ||
                message.includes("Student schedule API error")
                ? 502
                : 400;

            res.status(statusCode).send({ message, error });
        }
    }
}

export const employeeUnavailabilityRouter = new EmployeeUnavailabilityRouter();