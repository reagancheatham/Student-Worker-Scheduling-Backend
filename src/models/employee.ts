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
        router.get("/business/:businessID", this.getEmployeesForBusiness);
        router.get("/owners", this.getAllOwners);
        router.get("/:id", this.getEmployee);
    }

    private async getEmployee(req: Request, res: Response) {
        const id = req.params["id"];

        console.log(`Getting ${Employee.name} with id: ${id}`);

        await Employee.findOne({ where: { id }, include: User })
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

    private async getEmployeesForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        console.log(`Getting ${Employee.name}s with businessID: ${businessID}`);

        await Employee.findAll({ where: { businessID }, include: User })
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

    private async getAllOwners(req: Request, res: Response) {
        console.log(`Getting all Owners`);

        await Employee.findAll({
            include: [
                {
                    model: BusinessPermissionRole,
                    where: { name: "Owner" },
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
