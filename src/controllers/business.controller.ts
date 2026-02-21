import { Business } from "../models/business.model.ts";
import { RoutesUtil } from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export class BusinessController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<Business>(Business, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<Business, "id">(Business, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<Business, "id">(Business, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<Business, "id">(Business, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<Business>(Business, req, res);
    }
}
