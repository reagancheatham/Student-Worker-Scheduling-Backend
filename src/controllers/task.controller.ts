import { Task } from "../models/task.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class TaskController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Task>(Task, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Task, "id">(Task, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Task, "id">(Task, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Task>(Task, req, res);
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<Task>(Task, req, res);
    }
}
