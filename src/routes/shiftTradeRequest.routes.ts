import { Router } from "express";
import shiftTradeRequestController from "../controllers/shiftTradeRequest.controller.ts";

const router = Router();

router.post("/", shiftTradeRequestController.create);
router.put("/", shiftTradeRequestController.update);
router.delete("/:id", shiftTradeRequestController.delete);
router.get("/:id", shiftTradeRequestController.find);

export default router;
