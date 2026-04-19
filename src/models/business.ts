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
import { Logger } from "../classes/util/logger.ts";
import {
    businessAuth,
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { adminAuth, userAuth } from "../authentication.ts";

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

const idResolver: IDResolver = async (req: Request) => {
    let businessID = req.params?.id;

    if (!businessID) businessID = req.body?.businessID;

    const numID = Number(businessID);

    if (!numID || isNaN(numID)) return undefined;
    else return numID;
};

class BusinessRouter extends ModelRouter {
    public path(): string {
        return "/businesses";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), async (req, res) =>
            this.createBusiness(req, res),
        );
        router.put("/", managerAuth(idResolver), (req, res) =>
            this.updateBusiness(req, res),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(Business, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(Business, req, res, "id"),
        );
        router.get("/", adminAuth(), (req, res) =>
            ScheduleDatabase.getAll(Business, req, res),
        );
        router.get("/user/:id", userAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(Business, req, res, {
                include: [
                    {
                        model: Employee,
                        required: true,
                        include: [
                            {
                                model: User,
                                required: true,
                                where: { id: req.params.id },
                            },
                        ],
                    },
                ],
            }),
        );
    }

    private async updateBusiness(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(`Error editing Business: info is null`);
            return res.status(400).send("Invalid request body");
        }

        let invitePayload: any = null;
        let oldEmployee: Employee;

        Logger.log(`Editing Business with info: ${JSON.stringify(info)}`);

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

                    return Business.update(info.business, {
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

                            Logger.log(`Updated ${data[0]} business(es)`);

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
                                        Logger.error("Update failed:", err);
                                        throw err;
                                    });
                            });
                        })
                        .catch((err) => {
                            Logger.error("Update failed:", err);
                            throw err;
                        });
                });
            })
            .then(() => {
                Logger.log("Successful Transaction");

                if (invitePayload) {
                    Employee.destroy({ where: { id: oldEmployee.id } });
                    Logger.log(`Deleting employee and sending invite`);
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
                Logger.error("Transaction failed:", error);
                return res.status(500).send({ error });
            });
    }

    private async createBusiness(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(`Error creating Business: info is null`);
            return res.status(400).send("Invalid request body");
        }

        if (!info.email || Array.isArray(info.email)) {
            Logger.log("Invalid email param");
            return res.status(400).send("Invalid email");
        }

        Logger.log(`Creating Business with info: ${JSON.stringify(info)}`);

        let newInvite: any = null;
        let createdBusiness: any = null;

        sequelizeInstance
            .transaction((transaction: any) => {
                return Business.create(
                    { name: info.business.name },
                    { transaction },
                )
                    .then((business) => {
                        Logger.log(`Successfully created Business`);

                        createdBusiness = business;

                        return this.invite(info.email, business, transaction);
                    })
                    .then((result) => {
                        newInvite = result;
                    });
            })
            .then(() => {
                Logger.log("Successful Transaction");

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
                Logger.error("Transaction failed:", error);
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
