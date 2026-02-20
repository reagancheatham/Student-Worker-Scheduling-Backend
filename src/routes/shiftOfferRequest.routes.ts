import { Router } from "express";
import shiftOfferRequestController from "../controllers/shiftOfferRequest.controller.ts";

const ShiftOfferRequestRouter = Router();

ShiftOfferRequestRouter.post("/", shiftOfferRequestController.create);
ShiftOfferRequestRouter.put("/", shiftOfferRequestController.update);
ShiftOfferRequestRouter.delete("/:id", shiftOfferRequestController.delete);
ShiftOfferRequestRouter.get("/:id", shiftOfferRequestController.find);

export { ShiftOfferRequestRouter };
