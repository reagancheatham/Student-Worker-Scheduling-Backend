import { Router } from "express";
import shiftController from "../controllers/shift.controller.ts";

const router = Router();

router.post("/", shiftController.create);
router.put("/", shiftController.update);
router.delete("/:id", shiftController.delete);
router.get("/:id", shiftController.find);

export default router;
