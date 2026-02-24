import { Business } from "../models/business.model.ts";
import { ControllerUtil } from "../util/controllerUtil.ts";
import type { Request, Response } from "express";

export class BusinessController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Business>(Business, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Business>(Business, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Business>(Business, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Business>(Business, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<Business>(Business, req, res);
    }
}
