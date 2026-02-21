import { TimeSheet } from "../models/timeSheet.model.ts";
import type { Request, Response } from "express";
import { RoutesUtil } from "../util/routesUtil.ts";

export class TimeSheetController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<TimeSheet>(TimeSheet, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<TimeSheet, "id">(TimeSheet, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<TimeSheet, "id">(TimeSheet, req, res, "id");
    }
    static async get(req: Request, res: Response) {
        RoutesUtil.get<TimeSheet, "id">(TimeSheet, req, res, "id");
    }
    static async getAll(req: Request, res: Response) {
        RoutesUtil.getAll<TimeSheet>(TimeSheet, req, res);
    }
}
