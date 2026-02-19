import { Router } from "express";
import { TimeSheetController } from "../controllers/timesheet.controller.ts";

const TimeSheetRouter = Router();

TimeSheetRouter.post("/", TimeSheetController.create);
TimeSheetRouter.put("/", TimeSheetController.update);
TimeSheetRouter.delete("/:id", TimeSheetController.delete);
TimeSheetRouter.get("/:id", TimeSheetController.get);
TimeSheetRouter.get("/", TimeSheetController.getAll);

export { TimeSheetRouter };
