import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller.ts";

const ShiftRouter = Router();

ShiftRouter.post("/", ShiftController.create);
ShiftRouter.put("/", ShiftController.update);
ShiftRouter.delete("/:id", ShiftController.delete);
ShiftRouter.get("/:id", ShiftController.get);
ShiftRouter.get("/", ShiftController.getAll);

export { ShiftRouter };
