import { TaskList } from "../models/taskList.model.ts";
import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class TaskListController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(TaskList, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(TaskList, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(TaskList, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(TaskList, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ScheduleDatabase.getAll(TaskList, req, res);
    }
}
