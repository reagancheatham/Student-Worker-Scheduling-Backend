import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Employee } from "../models/employee";
import { Shift } from "../models/shift";
import { ShiftOfferRequest } from "../models/shiftOfferRequest";
import { ShiftOfferRequestNotification } from "../models/shiftOfferRequestNotification";
import { User } from "../models/user";
import {
    businessAuth,
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization";
import { Logger } from "../classes/util/logger";

const shiftOfferRequestNotificationIDResolver: IDResolver = async (
    req: Request,
) => {
    let id = req.params?.id;
    if (!id) id = req.body?.id;
    if (!id) return undefined;
    try {
        const shiftOfferRequestNotification =
            await ShiftOfferRequestNotification.findOne({
                where: { id },
                include: [
                    {
                        model: ShiftOfferRequest,
                        include: [
                            {
                                model: Shift,
                                attributes: ["businessID"],
                            },
                        ],
                    },
                ],
            });
        return (shiftOfferRequestNotification as any)?.ShiftOfferRequest?.Shift
            .businessID?.businessID;
    } catch (error: any) {
        Logger.error(
            `Error fetching ${ShiftOfferRequestNotification.name}: ${error}`,
        );
    }
};

class ShiftOfferRequestNotificationRouter extends ModelRouter {
    public path(): string {
        return "/shiftOfferRequestNotifications";
    }

    protected buildRouter(router: Router): void {
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftOfferRequestNotification,
                req,
                res,
                {
                    include: [
                        {
                            model: ShiftOfferRequest,
                            required: true,
                            include: [
                                {
                                    model: Shift,
                                    required: true,
                                    where: {
                                        businessID: req.params.businessID,
                                    },
                                    include: [
                                        {
                                            model: Employee,
                                            required: false,
                                            include: [
                                                {
                                                    model: User,
                                                    required: true,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ),
        );
        router.put(
            "/dismiss",
            managerAuth(shiftOfferRequestNotificationIDResolver),
            (req, res) => {
                ShiftOfferRequestNotificationRouter.dismiss(req, res);
            },
        );
    }

    private static async dismiss(req: Request, res: Response) {
        const { id } = req.body;
        Logger.log(id);

        const shiftOfferRequestNotification =
            await ShiftOfferRequestNotification.findByPk(id);

        if (!shiftOfferRequestNotification) {
            Logger.error(
                `Error updating ${ShiftOfferRequestNotification.name}: not found`,
            );
            return res.status(404).json({ message: "Notification not found" });
        }

        await ShiftOfferRequestNotification.update(
            { dismissed: true },
            { where: { id } },
        );

        Logger.log(`Dismissed ${ShiftOfferRequestNotification.name}`);
        return res.status(200).json({ message: "Notification dismissed" });
    }
}
export const shiftOfferRequestNotificationRouter =
    new ShiftOfferRequestNotificationRouter();
