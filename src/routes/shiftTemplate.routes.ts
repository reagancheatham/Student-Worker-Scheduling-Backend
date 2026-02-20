import { Router } from "express";
import shiftTemplateController from "../controllers/shiftTemplate.controller.ts";

const ShiftTemplateRouter = Router();

ShiftTemplateRouter.post("/", shiftTemplateController.create);
ShiftTemplateRouter.put("/", shiftTemplateController.update);
ShiftTemplateRouter.delete("/:id", shiftTemplateController.delete);
ShiftTemplateRouter.get("/:id", shiftTemplateController.find);

export { ShiftTemplateRouter };
