import { User } from "../models/user.model.ts";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class UserController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<User>(User, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<User, "id">(User, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<User, "id">(User, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<User, "id">(User, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<User>(User, req, res);
    }
}
