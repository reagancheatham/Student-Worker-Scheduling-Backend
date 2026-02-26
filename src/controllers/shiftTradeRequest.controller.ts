import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftTradeRequest } from "../models/shiftTradeRequest.model.ts";

export class ShiftTradeRequestController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(ShiftTradeRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(ShiftTradeRequest, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(ShiftTradeRequest, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(ShiftTradeRequest, req, res, "id");
    }
}
