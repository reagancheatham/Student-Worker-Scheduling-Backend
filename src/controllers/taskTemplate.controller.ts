import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { TaskTemplate } from "../models/taskTemplate.model.ts";

export class TaskTemplateController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(TaskTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(TaskTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(TaskTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(TaskTemplate, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ScheduleDatabase.getAll(TaskTemplate, req, res);
    }
}
