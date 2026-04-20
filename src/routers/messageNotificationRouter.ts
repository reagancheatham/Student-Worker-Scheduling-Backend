import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Employee } from "../models/employee";
import { MessageNotification } from "../models/messageNotification";
import { User } from "../models/user";
import { businessAuth } from "../authorization/businessAuthorization";

class MessageNotificationRouter extends ModelRouter {
    public path(): string {
        return "/messageNotifications";
    }

    protected buildRouter(router: Router): void {
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(MessageNotification, req, res, {
                include: [
                    {
                        model: Employee,
                        required: false,
                        where: { businessID: req.params.businessID },
                        include: [
                            {
                                model: User,
                                required: false,
                            },
                        ],
                    },
                ],
            }),
        );
    }
}

export const messageNotificationRouter = new MessageNotificationRouter();
