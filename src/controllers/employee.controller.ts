import { Employee } from "../models/employee.model";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class EmployeeController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<Employee>(Employee, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<Employee, "id">(Employee, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<Employee, "id">(Employee, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<Employee, "id">(Employee, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<Employee>(Employee, req, res);
    }
    static async getAllByBusiness(req: Request, res: Response) {
        RoutesUtil.getAllWhere<Employee, "businessID">(
            Employee,
            req,
            res,
            "businessID",
        );
    }
}
