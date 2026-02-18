import { Router } from "express";
import timeSheetController from "../controllers/timesheet.controller.ts";

const router = Router();

router.post("/", timeSheetController.create);
router.put("/", timeSheetController.update);
router.delete("/:id", timeSheetController.delete);
router.get("/:id", timeSheetController.get);
router.get("/", timeSheetController.getAll);

export default router;
