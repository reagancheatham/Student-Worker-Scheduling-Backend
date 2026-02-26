import { Task } from "../models/task.model.ts";
import type { Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class TaskController {
    static async create(req: Request, res: Response) {
        ScheduleDatabase.create(Task, req, res);
    }
    static async update(req: Request, res: Response) {
        ScheduleDatabase.update(Task, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ScheduleDatabase.delete(Task, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ScheduleDatabase.get(Task, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ScheduleDatabase.getAll(Task, req, res);
    }
}
