import { TaskList } from "../models/taskList.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class TaskListController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<TaskList>(TaskList, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<TaskList, "id">(TaskList, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<TaskList, "id">(TaskList, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<TaskList>(TaskList, req, res);
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<TaskList>(TaskList, req, res);
    }
    static async getAllForBusiness(req: Request, res: Response) {
        ControllerUtil.getAllWhere<TaskList, "businessID">(
            TaskList,
            req,
            res,
            "businessID",
        );
    }
}
