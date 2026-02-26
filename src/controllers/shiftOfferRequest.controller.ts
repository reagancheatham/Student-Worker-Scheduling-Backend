import type { Request, Response } from "express";
import { ShiftOfferRequest } from "../models/shiftOfferRequest.model.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ShiftOfferRequestController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(ShiftOfferRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(ShiftOfferRequest, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(ShiftOfferRequest, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(ShiftOfferRequest, req, res, "id");
    }
}
