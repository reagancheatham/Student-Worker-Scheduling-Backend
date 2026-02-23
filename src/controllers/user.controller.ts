import { User } from "../models/user.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class UserController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<User>(User, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<User, "id">(User, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<User, "id">(User, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<User>(User, req, res);
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<User>(User, req, res);
    }
}
