import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { User } from "./user.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Employee extends Model<
    InferAttributes<Employee>,
    InferCreationAttributes<Employee>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare userID: number;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID", "userID"],
                name: "employeeIndex",
            },
        ],
    },
);

class EmployeeRouter extends ModelRouter {
    public path(): string {
        return "/employees";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Employee, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Employee, req, res, "businessID", "id"),
        );
        router.delete("/:businessID/:id", (req, res) =>
            ScheduleDatabase.delete(Employee, req, res, "businessID", "id"),
        );
        router.get("/:businessID/:id", (req, res) =>
            ScheduleDatabase.get(Employee, req, res, "businessID", "id"),
        );
        router.get("/:businessID", (req, res) =>
            ScheduleDatabase.get(Employee, req, res, "businessID"),
        );
    }
}

export const employeeRouter = new EmployeeRouter();
