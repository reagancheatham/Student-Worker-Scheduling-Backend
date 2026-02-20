import { Router } from "express";
import { TimeOffRequestController } from "../controllers/timeOffRequest.controller.ts";

const TimeOffRequestRouter = Router();

TimeOffRequestRouter.post("/", TimeOffRequestController.create);
TimeOffRequestRouter.put("/", TimeOffRequestController.update);
TimeOffRequestRouter.delete("/:id", TimeOffRequestController.delete);
TimeOffRequestRouter.get("/:id", TimeOffRequestController.get);

export { TimeOffRequestRouter };
