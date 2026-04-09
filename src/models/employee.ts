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
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";

export class Employee extends Model<
    InferAttributes<Employee>,
    InferCreationAttributes<Employee>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare userID: number;
    declare businessPermissionRoleID: number;
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
            onDelete: "CASCADE",
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
        businessPermissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: BusinessPermissionRole,
                key: "id",
            },
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
            ScheduleDatabase.update(Employee, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Employee, req, res, "id"),
        );
        router.get("/business/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                Employee,
                req,
                res,
                { include: User },
                "businessID",
            ),
        );
        router.get("/owners", this.getAllOwners);
        router.get("/:id", (req, res) =>
            ScheduleDatabase.getWhere(
                Employee,
                req,
                res,
                { include: User },
                "id",
            ),
        );
        router.get("/user/:userID/business/:businessID", (req, res) =>
            ScheduleDatabase.getWhere(
                Employee,
                req,
                res,
                { include: User },
                "userID",
                "businessID",
            ),
        );
    }

    private async getAllOwners(req: Request, res: Response) {
        console.log(`Getting all Owners`);

        await Employee.findAll({
            include: [
                {
                    model: BusinessPermissionRole,
                    attributes: [],
                    where: { name: "Owner" },
                    required: true,
                },
                Business,
                User,
            ],
        })
            .then((result) => {
                console.log(
                    `Found ${Employee.name}: ${JSON.stringify(result)}`,
                );
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error finding ${Employee.name}: ${error}`);
                res.status(500).send({ error });
            });
    }
}

export const employeeRouter = new EmployeeRouter();
