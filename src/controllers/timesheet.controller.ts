import { TimeSheet } from "../models/timeSheet.model.ts";
import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class TimeSheetController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(TimeSheet, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(TimeSheet, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(TimeSheet, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(TimeSheet, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ScheduleDatabase.getAll(TimeSheet, req, res);
    }
}
