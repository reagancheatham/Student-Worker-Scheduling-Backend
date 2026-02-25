import { TimeSheet } from "../models/timeSheet.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class TimeSheetController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create(TimeSheet, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update(TimeSheet, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete(TimeSheet, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get(TimeSheet, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll(TimeSheet, req, res);
    }
}
