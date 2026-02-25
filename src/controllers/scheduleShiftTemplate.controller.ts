import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { ScheduleShiftTemplate } from "../models/scheduleShiftTemplate.model.ts";

export class ScheduleShiftTemplateController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(ScheduleShiftTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(ScheduleShiftTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(ScheduleShiftTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(ScheduleShiftTemplate, req, res, "id");
    }
}
