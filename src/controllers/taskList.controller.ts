import { TaskList } from "../models/taskList.model.ts";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class TaskListController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<TaskList>(TaskList, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<TaskList, "id">(TaskList, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<TaskList, "id">(TaskList, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<TaskList, "id">(TaskList, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<TaskList>(TaskList, req, res);
    }
    static async getAllForBusiness(req: Request, res: Response) {
        RoutesUtil.getAllWhere<TaskList, "businessID">(
            TaskList,
            req,
            res,
            "businessID",
        );
    }
}
