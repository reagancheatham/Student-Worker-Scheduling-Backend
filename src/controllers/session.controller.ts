import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { Session } from "../models/session.model.ts";

export class SessionController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(Session, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(Session, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(Session, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(Session, req, res, "id");
    }
}
