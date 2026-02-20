import { Router } from "express";
import { ShiftTemplateController } from "../controllers/shiftTemplate.controller.ts";

const ShiftTemplateRouter = Router();

ShiftTemplateRouter.post("/", ShiftTemplateController.create);
ShiftTemplateRouter.put("/", ShiftTemplateController.update);
ShiftTemplateRouter.delete("/:id", ShiftTemplateController.delete);
ShiftTemplateRouter.get("/:id", ShiftTemplateController.get);

export { ShiftTemplateRouter };
