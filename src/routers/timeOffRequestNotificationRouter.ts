import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Employee } from "../models/employee";
import { TimeOffRequest } from "../models/timeOffRequest";
import { TimeOffRequestNotification } from "../models/timeOffRequestNotification";
import { User } from "../models/user";
import {
    businessAuth,
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization";
import { Logger } from "../classes/util/logger";

const timeOffRequestNotificationIDResolver: IDResolver = async (
    req: Request,
) => {
    let id = req.params?.id;
    if (!id) id = req.body?.id;
    if (!id) return undefined;
    try {
        const timeOffRequestNotification =
            await TimeOffRequestNotification.findOne({
                where: { id },
                include: [
                    {
                        model: TimeOffRequest,
                        include: [
                            {
                                model: Employee,
                                attributes: ["businessID"],
                            },
                        ],
                    },
                ],
            });
        return (timeOffRequestNotification as any)?.TimeOffRequest?.Employee
            ?.businessID;
    } catch (error: any) {
        Logger.error(
            `Error fetching ${TimeOffRequestNotification.name}: ${error}`,
        );
    }
};

class TimeOffRequestNotificationRouter extends ModelRouter {
    public path(): string {
        return "/timeOffRequestNotifications";
    }

    protected buildRouter(router: Router): void {
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(TimeOffRequestNotification, req, res, {
                include: [
                    {
                        model: TimeOffRequest,
                        required: true,
                        include: [
                            {
                                model: Employee,
                                required: true,
                                where: {
                                    businessID: req.params.businessID,
                                },
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
            }),
        );
        router.put(
            "/dismiss",
            managerAuth(timeOffRequestNotificationIDResolver),
            (req, res) => {
                TimeOffRequestNotificationRouter.dismiss(req, res);
            },
        );
    }

    private static async dismiss(req: Request, res: Response) {
        const { id } = req.body;
        Logger.log(id);

        const timeOffRequestNotification =
            await TimeOffRequestNotification.findByPk(id);

        if (!timeOffRequestNotification) {
            Logger.error(
                `Error updating ${TimeOffRequestNotification.name}: not found`,
            );
            return res.status(404).json({ message: "Notification not found" });
        }

        await TimeOffRequestNotification.update(
            { dismissed: true },
            { where: { id } },
        );

        Logger.log(`Dismissed ${TimeOffRequestNotification.name}`);
        return res.status(200).json({ message: "Notification dismissed" });
    }
}

export const timeOffRequestNotificationRouter =
    new TimeOffRequestNotificationRouter();
