import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class EmployeeUnavailability extends Model<
    InferAttributes<EmployeeUnavailability>,
    InferCreationAttributes<EmployeeUnavailability>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
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
        router.post("/", (req, res) => ScheduleDatabase.create(EmployeeUnavailability, req, res));
        router.put("/", (req, res) => ScheduleDatabase.update(EmployeeUnavailability, req, res, "id"));
        router.delete("/:id", (req, res) => ScheduleDatabase.delete(EmployeeUnavailability, req, res, "id"));
        router.get("/:id", (req, res) => ScheduleDatabase.get(EmployeeUnavailability, req, res, "id"));
        router.get("/:employeeID", (req, res) => ScheduleDatabase.getAllWhere(EmployeeUnavailability, req, res, ["employeeID"]));
    }
}

export const employeeUnavailabilityRouter = new EmployeeUnavailabilityRouter();