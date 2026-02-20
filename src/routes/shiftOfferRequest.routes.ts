import { Router } from "express";
import { ShiftOfferRequestController } from "../controllers/shiftOfferRequest.controller.ts";

const ShiftOfferRequestRouter = Router();

ShiftOfferRequestRouter.post("/", ShiftOfferRequestController.create);
ShiftOfferRequestRouter.put("/", ShiftOfferRequestController.update);
ShiftOfferRequestRouter.delete("/:id", ShiftOfferRequestController.delete);
ShiftOfferRequestRouter.get("/:id", ShiftOfferRequestController.get);

export { ShiftOfferRequestRouter };
