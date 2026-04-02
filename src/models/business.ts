import { Model, DataTypes } from "sequelize";
import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase as ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Request, Response, Router } from "express";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { Invite } from "./invite.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";

export class Business extends Model<
    InferAttributes<Business>,
    InferCreationAttributes<Business>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class BusinessRouter extends ModelRouter {
    public path(): string {
        return "/businesses";
    }

    protected buildRouter(router: Router): void {
        router.post("/", async (req, res) => this.post(req, res));
        router.put("/", (req, res) => this.put(req, res));
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Business, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Business, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Business, req, res),
        );
    }

    private async put(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            console.error(`Error editing Business: info is null`);
            return res.status(400).send("Invalid request body");
        }

        let invitePayload: any = null;
        let oldEmployee: Employee;

        console.log(`Editing Business with info: ${JSON.stringify(info)}`);

        sequelizeInstance
            .transaction((transaction: any) => {
                return Employee.findOne({
                    where: { businessID: info.business.id },
                    include: [
                        User,
                        {
                            model: BusinessPermissionRole,
                            where: { name: "Owner" },
                        },
                    ],
                    transaction,
                }).then(async (data: any) => {
                    oldEmployee = data;

                    if (!oldEmployee) {
                        throw new Error("Employee not found");
                    }

                    const isEmailChanged =
                        info.email !== undefined &&
                        data.User?.email !== info.email;

                    return Business.update(info, {
                        where: { id: info.business.id },
                        transaction,
                        returning: true,
                    })
                        .then(([count]) => {
                            if (count === 0) {
                                throw new Error(
                                    "Could not find a business to update",
                                );
                            }

                            console.log(`Updated ${data[0]} business(es)`);

                            return Business.update(info, {
                                where: { id: info.business.id },
                                transaction,
                                returning: true,
                            }).then(() => {
                                return Business.findOne({
                                    where: { id: info.business.id },
                                    transaction,
                                })
                                    .then((business) => {
                                        if (isEmailChanged && business) {
                                            return this.invite(
                                                info.email,
                                                business,
                                                transaction,
                                            ).then((inviteResult) => {
                                                invitePayload = inviteResult;
                                                return inviteResult;
                                            });
                                        }
                                    })
                                    .catch((err) => {
                                        console.error("Update failed:", err);
                                        throw err;
                                    });
                            });
                        })
                        .catch((err) => {
                            console.error("Update failed:", err);
                            throw err;
                        });
                });
            })
            .then(() => {
                console.log("Successful Transaction");

                if (invitePayload) {
                    Employee.destroy({ where: { id: oldEmployee.id } });
                    console.log(`Deleting employee and sending invite`);
                    return Invite.sendInviteEmail(
                        invitePayload.email,
                        invitePayload.code,
                        invitePayload.businessName,
                    );
                }
            })
            .then(() => {
                return res.status(200).send({ success: true });
            })
            .catch((error: any) => {
                console.error("Transaction failed:", error);
                return res.status(500).send({ error });
            });
    }

    private async post(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            console.error(`Error creating Business: info is null`);
            return res.status(400).send("Invalid request body");
        }

        if (!info.email || Array.isArray(info.email)) {
            console.log("Invalid email param");
            return res.status(400).send("Invalid email");
        }

        console.log(`Creating Business with info: ${JSON.stringify(info)}`);

        let newInvite: any = null;
        let createdBusiness: any = null;

        sequelizeInstance
            .transaction((transaction: any) => {
                return Business.create({ name: info.name }, { transaction })
                    .then((business) => {
                        console.log(`Successfully created Business`);

                        createdBusiness = business;

                        return this.invite(info.email, business, transaction);
                    })
                    .then((result) => {
                        newInvite = result;
                    });
            })
            .then(() => {
                console.log("Successful Transaction");

                if (newInvite) {
                    return Invite.sendInviteEmail(
                        newInvite.email,
                        newInvite.code,
                        newInvite.businessName,
                    );
                }
            })
            .then(() => {
                return res.status(200).send(createdBusiness);
            })
            .catch((error: any) => {
                console.error("Transaction failed:", error);
                return res.status(500).send({ error });
            });
    }

    private async invite(
        email: string,
        business: Business,
        transaction: Transaction,
    ) {
        return BusinessPermissionRole.findOne({
            where: { name: "Owner" },
            transaction,
        }).then((role) => {
            if (!role) {
                throw new Error("Owner role not found");
            }

            return Invite.createInvite(email, business, role.id, transaction);
        });
    }
}
export const businessRouter = new BusinessRouter();
