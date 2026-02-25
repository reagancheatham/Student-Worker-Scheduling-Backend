import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { TaskTemplate } from "../models/taskTemplate.model.ts";

export class TaskTemplateController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(TaskTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(TaskTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(TaskTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(TaskTemplate, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll(TaskTemplate, req, res);
    }
}
