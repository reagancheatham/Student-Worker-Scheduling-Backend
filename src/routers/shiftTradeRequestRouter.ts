import { Request, Response, Router } from "express";
import { IDResolver, userBusinessAuth, businessAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { ShiftTradeRequest } from "../models/shiftTradeRequest.ts";
import { User } from "../models/user.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const tradeRequest = await ShiftTradeRequest.findOne({
        where: { id },
        include: Shift,
    });

    return (tradeRequest as any)?.Shift?.businessID;
};

const shiftIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.shiftID;

    if (!id) id = req.body?.shiftID;

    if (!id) return undefined;

    const shift = await Shift.findOne({ where: { id } });

    return shift?.businessID;
};

const userIDResolver: IDResolver = async (req: Request) => {
    let shiftID = req.body?.shiftID;

    if (!shiftID) {
        const id = req.params?.id;

        if (!id) return undefined;

        const tradeRequest = await ShiftTradeRequest.findOne({ where: { id } });

        if (!tradeRequest) return undefined;

        shiftID = tradeRequest?.shiftID?.toString();
    }

    if (!shiftID) return undefined;

    const shift = await Shift.findOne({
        where: { id: shiftID },
        include: [
            {
                model: Employee,
                include: [
                    {
                        model: User,
                        attributes: ["id"],
                    },
                ],
            },
        ],
    });

    return (shift as any)?.Employee?.User?.id;
};

class ShiftTradeRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequests";
    }

    protected buildRouter(router: Router): void {
        router.post(
            "/",
            userBusinessAuth(shiftIDResolver, userIDResolver),
            (req, res) => ScheduleDatabase.create(ShiftTradeRequest, req, res),
        );
        router.put(
            "/",
            userBusinessAuth(shiftIDResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.update(ShiftTradeRequest, req, res, "id"),
        );
        router.delete(
            "/:id",
            userBusinessAuth(idResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.delete(ShiftTradeRequest, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "id"),
        );
        router.get(
            "/shift/:shiftID",
            businessAuth(shiftIDResolver),
            (req, res) =>
                ScheduleDatabase.get(ShiftTradeRequest, req, res, "shiftID"),
        );
    }
}

export const shiftTradeRequestRouter = new ShiftTradeRequestRouter();