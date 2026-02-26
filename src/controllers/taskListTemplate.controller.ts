import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { TaskListTemplate } from "../models/taskListTemplate.model.ts";

export class TaskListTemplateController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(TaskListTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(TaskListTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(TaskListTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(TaskListTemplate, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ScheduleDatabase.getAll(TaskListTemplate, req, res);
    }
}
