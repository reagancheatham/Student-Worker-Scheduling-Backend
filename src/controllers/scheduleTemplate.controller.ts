import { ScheduleTemplate } from "../models/scheduleTemplate.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class ScheduleTemplateController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<ScheduleTemplate>(ScheduleTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<ScheduleTemplate, "id">(
            ScheduleTemplate,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<ScheduleTemplate, "id">(
            ScheduleTemplate,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<ScheduleTemplate, "id">(
            ScheduleTemplate,
            req,
            res,
            "id",
        );
    }
    static async getAllForBusiness(req: Request, res: Response) {
        ControllerUtil.getAllWhere<ScheduleTemplate, "businessID">(
            ScheduleTemplate,
            req,
            res,
            "businessID",
        );
    }
}
