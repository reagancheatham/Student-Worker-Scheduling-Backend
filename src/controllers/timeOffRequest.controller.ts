import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { TimeOffRequest } from "../models/timeOffRequest.model.ts";

export class TimeOffRequestController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<TimeOffRequest>(TimeOffRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<TimeOffRequest, "id">(
            TimeOffRequest,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<TimeOffRequest, "id">(
            TimeOffRequest,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<TimeOffRequest>(
            TimeOffRequest,
            req,
            res,
        );
    }
}
