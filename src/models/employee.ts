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
            ScheduleDatabase.update(Employee, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Employee, req, res, "id"),
        );
        router.get("/:id", this.getEmployee);
        router.get("/business/:businessID", this.getEmployeesForBusiness);
        router.get("/:userID", this.getEmployeeByUserID);
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

    private async getEmployeeByUserID(req: Request, res: Response) {
        const userID = req.params["userID"];

        console.log(`Getting ${Employee.name} by user id: ${userID}`);

        await Employee.findOne({ where: { userID }, include: User })
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
}

export const employeeRouter = new EmployeeRouter();
