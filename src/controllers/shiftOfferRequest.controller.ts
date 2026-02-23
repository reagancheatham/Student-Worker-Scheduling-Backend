import type { Request, Response } from "express";
import { ShiftOfferRequest } from "../models/shiftOfferRequest.model.ts";
import { ControllerUtil } from "../util/controllerUtil.ts";

export class ShiftOfferRequestController {
    static async create(req: Request, res: Response) {
        ControllerUtil.create<ShiftOfferRequest>(ShiftOfferRequest, req, res);
    }
    static async update(req: Request, res: Response) {
        ControllerUtil.update<ShiftOfferRequest, "id">(
            ShiftOfferRequest,
            req,
            res,
            "id",
        );
    }
    static async delete(req: Request, res: Response) {
        ControllerUtil.delete<ShiftOfferRequest, "id">(
            ShiftOfferRequest,
            req,
            res,
            "id",
        );
    }
    static async get(req: Request, res: Response) {
        ControllerUtil.get<ShiftOfferRequest>(
            ShiftOfferRequest,
            req,
            res,
        );
    }
}
