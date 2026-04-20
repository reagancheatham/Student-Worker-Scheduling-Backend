import { Request, Router } from "express";
import { ModelRouter } from "../classes/databaseModel";
import { ScheduleDatabase } from "../classes/scheduleDatabase";
import { Employee } from "../models/employee";
import { Shift } from "../models/shift";
import { ShiftTradeRequest } from "../models/shiftTradeRequest";
import { ShiftTradeRequestNotification } from "../models/shiftTradeRequestNotification";
import { User } from "../models/user";
import { businessAuth, IDResolver } from "../authorization/businessAuthorization";


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
    }
}

export const shiftTradeRequestNotificationRouter =
    new ShiftTradeRequestNotificationRouter();
