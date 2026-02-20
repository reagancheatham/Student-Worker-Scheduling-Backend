import { Router } from "express";
import shiftController from "../controllers/shift.controller.ts";

const ShiftRouter = Router();

ShiftRouter.post("/", shiftController.create);
ShiftRouter.put("/", shiftController.update);
ShiftRouter.delete("/:id", shiftController.delete);
ShiftRouter.get("/:id", shiftController.find);

export { ShiftRouter };
