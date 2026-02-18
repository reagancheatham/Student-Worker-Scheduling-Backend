import { Router } from "express";
import timeOffRequestController from "../controllers/timeOffRequest.controller.ts";

const router = Router();

router.post("/", timeOffRequestController.create);
router.put("/", timeOffRequestController.update);
router.delete("/:id", timeOffRequestController.delete);
router.get("/:id", timeOffRequestController.find);

export default router;
