import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { User } from "./user.ts";
import { EmployeeUnavailabilitySyncService } from "../services/employeeUnavailabilitySyncService.ts";

export class EmployeeUnavailability extends Model<
    InferAttributes<EmployeeUnavailability>,
    InferCreationAttributes<EmployeeUnavailability>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare term: CreationOptional<string | null>;
}

EmployeeUnavailability.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        term: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["employeeID", "startTime", "endTime"],
            },
        ],
    },
);

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
            let employeesSkipped = 0;
            let blocksPrepared = 0;
            let blocksInserted = 0;
            let blocksUpdated = 0;
            let blocksRemoved = 0;

            for (const employee of employees) {
                const importResult = await this.importForEmployee(employee, termCode);

                if (!importResult) {
                    employeesSkipped += 1;
                    continue;
                }

                employeesProcessed += 1;
                blocksPrepared += importResult.blocksPrepared;
                blocksInserted += importResult.blocksInserted;
                blocksUpdated += importResult.blocksUpdated;
                blocksRemoved += importResult.blocksRemoved;
            }

            res.status(200).send({
                businessID,
                termCode,
                employeesFound: employees.length,
                employeesProcessed,
                employeesSkipped,
                blocksPrepared,
                blocksInserted,
                blocksUpdated,
                blocksRemoved,
            });
        } catch (error) {
            console.error(`Error importing student schedules: ${error}`);
            const message = error instanceof Error ? error.message : "Failed to import student schedules";
            const statusCode = message.includes("Student schedule API returned an unsuccessful response")
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

            const importResult = await this.importForEmployee(employee, termCode);

            if (!importResult) {
                res.status(400).send({ message: "Employee is missing a valid studentID/email for schedule lookup" });
                return;
            }

            res.status(200).send({
                employeeID,
                termCode,
                blocksPrepared: importResult.blocksPrepared,
                blocksInserted: importResult.blocksInserted,
                blocksUpdated: importResult.blocksUpdated,
                blocksRemoved: importResult.blocksRemoved,
            });
        } catch (error) {
            console.error(`Error importing student schedule for employee ${employeeID}: ${error}`);
            const message = error instanceof Error ? error.message : "Failed to import student schedule";
            const statusCode = message.includes("Student schedule API returned an unsuccessful response")
                ? 502
                : 400;

            res.status(statusCode).send({ message, error });
        }
    }

    private async importForEmployee(
        employee: Employee,
        termCode: string,
    ): Promise<{
        blocksPrepared: number;
        blocksInserted: number;
        blocksUpdated: number;
        blocksRemoved: number;
    } | null> {
        const user = (employee as Employee & { User?: User }).User;
        if (!user) {
            return null;
        }

        const syncResult = await EmployeeUnavailabilitySyncService.syncForEmployee(
            employee.id,
            {
                studentID: user.studentID,
                email: user.email,
            },
            termCode,
        );

        return syncResult;
    }
}

export const employeeUnavailabilityRouter = new EmployeeUnavailabilityRouter();