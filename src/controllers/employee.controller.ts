import { Employee } from "../models/employee.model";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class EmployeeController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(Employee, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(Employee, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(Employee, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(Employee, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll(Employee, req, res);
    }
    static async getAllByBusiness(req: Request, res: Response) {
        ControllerUtil.getAllWhere(
            Employee,
            req,
            res,
            "businessID",
        );
    }
}
