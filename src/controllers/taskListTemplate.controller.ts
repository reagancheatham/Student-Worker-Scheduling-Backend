import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { TaskListTemplate } from "../models/taskListTemplate.model.ts";

export class TaskListTemplateController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(TaskListTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(TaskListTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(TaskListTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(TaskListTemplate, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll(TaskListTemplate, req, res);
    }
}
