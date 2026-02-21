import { Task } from "../models/task.model.ts";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class TaskController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<Task>(Task, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<Task, "id">(Task, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<Task, "id">(Task, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<Task, "id">(Task, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<Task>(Task, req, res);
    }
}
