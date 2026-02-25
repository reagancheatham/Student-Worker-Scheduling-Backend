import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { PermissionRole } from "../models/permissionRole.model.ts";

export class PermissionRoleController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(PermissionRole, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(
            PermissionRole,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(
            PermissionRole,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(
            PermissionRole,
            req,
            res,
            "id",
        );
    }
}
