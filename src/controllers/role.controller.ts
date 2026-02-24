import type { Request, Response } from "express";
import { Role } from "../models/role.model.ts";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class RoleController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Role>(Role, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Role, "id">(Role, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Role, "id">(Role, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Role, "id">(Role, req, res, "id");
    }
    static async getForBusiness(req: Request, res: Response) {
        ControllerUtil.get<Role, "businessID">(Role, req, res, "businessID");
    }
}
