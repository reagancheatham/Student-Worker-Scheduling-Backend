import { Employee } from "../models/employee.model";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class EmployeeController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Employee>(Employee, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Employee, "id">(Employee, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Employee, "id">(Employee, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Employee>(Employee, req, res);
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<Employee>(Employee, req, res);
    }
    static async getAllByBusiness(req: Request, res: Response) {
        ControllerUtil.getAllWhere<Employee, "businessID">(
            Employee,
            req,
            res,
            "businessID",
        );
    }
}
