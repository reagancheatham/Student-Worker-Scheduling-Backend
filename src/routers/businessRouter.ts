import { Request, Response, Router } from "express";
import { Transaction } from "sequelize";
import { adminAuth, userAuth } from "../authentication";
import {
    IDResolver,
    managerAuth,
    businessAuth,
} from "../authorization/businessAuthorization";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Logger } from "../classes/util/logger";
import { sequelizeInstance } from "../config/sequelizeInstance";
import { Business } from "../models/business";
import { BusinessPermissionRole } from "../models/businessPermissionRole";
import { Employee } from "../models/employee";
import { Invite } from "../models/invite";
import { User } from "../models/user";

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

        if (!info.business?.name) {
            Logger.log("Invalid business name param");
            return res.status(400).send("Invalid business name");
        }

        Logger.log(
            `Creating Business invite with info: ${JSON.stringify(info)}`,
        );

        try {
            const role = await BusinessPermissionRole.findOne({
                where: { name: "Owner" },
            });

            if (!role) throw new Error("Owner role not found");

            // No business row created here — handleInvite does that on acceptance.
            const inviteResult = await Invite.createOwnerInvite(
                info.email,
                info.business.name,
                role.id,
            );

            await Invite.sendInviteEmail(
                inviteResult.email,
                inviteResult.code,
                inviteResult.intendedBusinessName,
            );

            Logger.log(
                `Owner invite sent to ${info.email} for business "${info.business.name}"`,
            );

            return res.status(200).send({ success: true });
        } catch (error: any) {
            Logger.error("Create business failed:", error);
            return res.status(500).send({ error });
        }
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
