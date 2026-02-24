import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { Shift } from "../models/shift.model.ts";

export class ShiftController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Shift>(Shift, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Shift, "id">(Shift, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Shift, "id">(Shift, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Shift, "id">(Shift, req, res, "id");
    }
}
