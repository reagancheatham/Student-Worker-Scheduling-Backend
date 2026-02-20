import { Router } from "express";
import timeOffRequestController from "../controllers/timeOffRequest.controller.ts";

const TimeOffRequestRouter = Router();

TimeOffRequestRouter.post("/", timeOffRequestController.create);
TimeOffRequestRouter.put("/", timeOffRequestController.update);
TimeOffRequestRouter.delete("/:id", timeOffRequestController.delete);
TimeOffRequestRouter.get("/:id", timeOffRequestController.find);

export {TimeOffRequestRouter};
