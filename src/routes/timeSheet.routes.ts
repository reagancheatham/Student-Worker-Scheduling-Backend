import { Router } from "express";
import timeSheetController from "../controllers/timeSheet.controller.ts";

const router = Router();

router.post("/", timeSheetController.create);
router.put("/", timeSheetController.update);
router.delete("/:id", timeSheetController.delete);
router.get("/:id", timeSheetController.find);

export default router;
