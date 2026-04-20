import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Employee } from "../models/employee";
import { Shift } from "../models/shift";
import { ShiftTradeRequest } from "../models/shiftTradeRequest";
import { ShiftTradeRequestNotification } from "../models/shiftTradeRequestNotification";
import { User } from "../models/user";
import {
    businessAuth,
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization";
import { Logger } from "../classes/util/logger";

const shiftTradeRequestNotificationIDResolver: IDResolver = async (
    req: Request,
) => {
    let id = req.params?.id;
    if (!id) id = req.body?.id;
    if (!id) return undefined;
    try {
        const shiftTradeRequestNotification =
            await ShiftTradeRequestNotification.findOne({
                where: { id },
                include: [
                    {
                        model: ShiftTradeRequest,
                        include: [
                            {
                                model: Shift,
                                attributes: ["businessID"],
                            },
                        ],
                    },
                ],
            });
        return (shiftTradeRequestNotification as any)?.ShiftTradeRequest?.Shift
            .businessID?.businessID;
    } catch (error: any) {
        Logger.error(
            `Error fetching ${ShiftTradeRequestNotification.name}: ${error}`,
        );
    }
};

class ShiftTradeRequestNotificationRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequestNotifications";
    }

    protected buildRouter(router: Router): void {
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftTradeRequestNotification,
                req,
                res,
                {
                    include: [
                        {
                            model: ShiftTradeRequest,
                            required: true,
                            include: [
                                {
                                    model: Shift,
                                    required: true,
                                    include: [
                                        {
                                            model: Employee,
                                            as: "Employee",
                                            required: true,
                                            include: [
                                                { model: User, required: true },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    model: Employee,
                                    as: "TargetEmployee",
                                    required: true,
                                    include: [{ model: User, required: true }],
                                },
                            ],
                        },
                    ],
                },
            ),
        );
        router.put(
            "/dismiss",
            managerAuth(shiftTradeRequestNotificationIDResolver),
            (req, res) => {
                ShiftTradeRequestNotificationRouter.dismiss(req, res);
            },
        );
    }

    private static async dismiss(req: Request, res: Response) {
        const { id } = req.body;
        Logger.log(id);

        const shiftTradeRequestNotification =
            await ShiftTradeRequestNotification.findByPk(id);

        if (!shiftTradeRequestNotification) {
            Logger.error(
                `Error updating ${ShiftTradeRequestNotification.name}: not found`,
            );
            return res.status(404).json({ message: "Notification not found" });
        }

        await ShiftTradeRequestNotification.update(
            { dismissed: true },
            { where: { id } },
        );

        Logger.log(`Dismissed ${ShiftTradeRequestNotification.name}`);
        return res.status(200).json({ message: "Notification dismissed" });
    }
}

export const shiftTradeRequestNotificationRouter =
    new ShiftTradeRequestNotificationRouter();

