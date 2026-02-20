import { Router } from "express";
import shiftTradeRequestController from "../controllers/shiftTradeRequest.controller.ts";

const ShiftTradeRequestRouter = Router();

ShiftTradeRequestRouter.post("/", shiftTradeRequestController.create);
ShiftTradeRequestRouter.put("/", shiftTradeRequestController.update);
ShiftTradeRequestRouter.delete("/:id", shiftTradeRequestController.delete);
ShiftTradeRequestRouter.get("/:id", shiftTradeRequestController.find);

export { ShiftTradeRequestRouter };
