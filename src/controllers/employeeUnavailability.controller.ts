import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { EmployeeUnavailability } from "../models/employeeUnavailability.model.ts";

export class EmployeeUnavailabilityController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(EmployeeUnavailability, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(EmployeeUnavailability, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(EmployeeUnavailability, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(EmployeeUnavailability, req, res, "id");
    }
}
