import type { Request, Response } from "express";
import { ControllerUtil } from "../util/controllerUtil.ts";
import { ShiftTradeRequest } from "../models/shiftTradeRequest.model.ts";

export class ShiftTradeRequestController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<ShiftTradeRequest>(ShiftTradeRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<ShiftTradeRequest, "id">(
            ShiftTradeRequest,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<ShiftTradeRequest, "id">(
            ShiftTradeRequest,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<ShiftTradeRequest, "id">(
            ShiftTradeRequest,
            req,
            res,
            "id",
        );
    }
}
