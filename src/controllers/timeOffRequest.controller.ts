import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { TimeOffRequest } from "../models/timeOffRequest.model.ts";

export class TimeOffRequestController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(TimeOffRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(
            TimeOffRequest,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(
            TimeOffRequest,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(
            TimeOffRequest,
            req,
            res,
            "id",
        );
    }
}
