import { Router } from "express";
import { ScheduleTemplateController } from "../controllers/scheduleTemplate.controller.ts";

const ScheduleTemplateRouter = Router();

ScheduleTemplateRouter.post("/", ScheduleTemplateController.create);
ScheduleTemplateRouter.put("/", ScheduleTemplateController.update);
ScheduleTemplateRouter.delete("/:id", ScheduleTemplateController.delete);
ScheduleTemplateRouter.get("/:id", ScheduleTemplateController.get);
ScheduleTemplateRouter.get("/business/:businessID", ScheduleTemplateController.getAllForBusiness);

export {ScheduleTemplateRouter};
