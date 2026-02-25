import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { ShiftTemplate } from "../models/shiftTemplate.model.ts";

export class ShiftTemplateController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(ShiftTemplate, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(ShiftTemplate, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(ShiftTemplate, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(ShiftTemplate, req, res, "id");
    }
}
