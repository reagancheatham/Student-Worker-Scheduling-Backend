import { Router } from "express";
import { ShiftTradeRequestController } from "../controllers/shiftTradeRequest.controller.ts";

const ShiftTradeRequestRouter = Router();

ShiftTradeRequestRouter.post("/", ShiftTradeRequestController.create);
ShiftTradeRequestRouter.put("/", ShiftTradeRequestController.update);
ShiftTradeRequestRouter.delete("/:id", ShiftTradeRequestController.delete);
ShiftTradeRequestRouter.get("/:id", ShiftTradeRequestController.get);

export { ShiftTradeRequestRouter };
