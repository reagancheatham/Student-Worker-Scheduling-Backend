import { Router } from "express";
import shiftOfferRequestController from "../controllers/shiftOfferRequest.controller.ts";

const router = Router();

router.post("/", shiftOfferRequestController.create);
router.put("/", shiftOfferRequestController.update);
router.delete("/:id", shiftOfferRequestController.delete);
router.get("/:id", shiftOfferRequestController.find);

export default router;
