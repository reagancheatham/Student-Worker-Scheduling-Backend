import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { User } from "./user.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { Invite } from "./invite.ts";

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
        router.post("/business/:businessID", (req, res) =>
            EmployeeRouter.createEmployee(req, res),
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
        router.get("/owners", EmployeeRouter.getAllOwners);
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

    private static async getAllOwners(req: Request, res: Response) {
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

    private static async createEmployee(req: Request, res: Response) {
        let email = req.body.email;
        let businessID = req.params.businessID;

        return BusinessPermissionRole.findOne({
            where: { name: "Employee" },
        }).then(async (role) => {
            if (!role) {
                throw new Error("Employee role not found");
            }
            try {
                let business = await Business.findOne({
                    where: { id: businessID },
                });
                let employee = await Employee.findOne({
                    where: { businessID: businessID },
                    include: {
                        model: User,
                        where: { email: email },
                    },
                });
                if (business == null) {
                    res.status(500).send({ err: "Business not found!" });
                    return;
                }
                if (employee) {
                    console.log(employee);
                    res.status(500).send({
                        err: "Employee already exists in business!",
                    });
                    return;
                }
                let newInvite = await Invite.createInvite(
                    email,
                    business,
                    role.id,
                );
                if (newInvite) {
                    Invite.sendInviteEmail(
                        newInvite.email,
                        newInvite.code,
                        newInvite.businessName,
                    );
                }
                res.status(200).send({ body: "Successfully sent invite!" });
                return;
            } catch (err) {
                res.status(500).send({ err });
            }
        });
    }
}

export const employeeRouter = new EmployeeRouter();
