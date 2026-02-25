import { Router } from "express";
import { ScheduleShiftTemplateController } from "../controllers/scheduleShiftTemplate.controller.ts";

const ScheduleShiftTemplateRouter = Router();

ScheduleShiftTemplateRouter.post("/", ScheduleShiftTemplateController.create);
ScheduleShiftTemplateRouter.put("/", ScheduleShiftTemplateController.update);
ScheduleShiftTemplateRouter.delete(
    "/:id",
    ScheduleShiftTemplateController.delete,
);
ScheduleShiftTemplateRouter.get("/:id", ScheduleShiftTemplateController.get);

export { ScheduleShiftTemplateRouter };
