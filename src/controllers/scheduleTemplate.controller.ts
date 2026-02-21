import { ScheduleTemplate } from "../models/scheduleTemplate.model.ts";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class ScheduleTemplateController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<ScheduleTemplate>(ScheduleTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<ScheduleTemplate, "id">(ScheduleTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<ScheduleTemplate, "id">(ScheduleTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<ScheduleTemplate, "id">(ScheduleTemplate, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<ScheduleTemplate>(ScheduleTemplate, req, res);
    }
};
