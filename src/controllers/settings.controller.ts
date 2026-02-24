import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { Settings } from "../models/setting.model.ts";

export class SettingsController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<Settings>(Settings, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<Settings, "businessID">(
            Settings,
            req,
            res,
            "businessID",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<Settings, "businessID">(
            Settings,
            req,
            res,
            "businessID",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<Settings, "businessID">(
            Settings,
            req,
            res,
            "businessID",
        );
    }
}
