import { TimeSheet } from "../models/timeSheet.model.ts";
import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class TimeSheetController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<TimeSheet>(TimeSheet, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<TimeSheet, "id">(TimeSheet, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<TimeSheet, "id">(TimeSheet, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<TimeSheet>(TimeSheet, req, res);
    }
    static async getAll(req: Request, res: Response) {
        ControllerUtil.getAll<TimeSheet>(TimeSheet, req, res);
    }
}
