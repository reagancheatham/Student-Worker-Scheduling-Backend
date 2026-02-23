import { Router } from "express";
import { BusinessRouter } from "./business.routes.ts";
import { EmployeeRouter } from "./employee.routes.ts";
import { EmployeeUnavailabilityRouter } from "./employeeUnavailability.routes.ts";
import { PermissionRoleRouter } from "./permissionRole.routes.ts";
import { RoleRouter } from "./role.routes.ts";
import { ScheduleTemplateRouter } from "./scheduleTemplate.routes.ts";
import { SettingsRouter } from "./settings.routes.ts";
import { ShiftRouter } from "./shift.routes.ts";
import { ShiftOfferRequestRouter } from "./shiftOfferRequest.routes.ts";
import { ShiftTemplateRouter } from "./shiftTemplate.routes.ts";
import { ShiftTradeRequestRouter } from "./shiftTradeRequest.routes.ts";
import { TaskRouter } from "./task.routes.ts";
import { TaskListRouter } from "./taskList.routes.ts";
import { TimeOffRequestRouter } from "./timeOffRequest.routes.ts";
import { TimeSheetRouter } from "./timeSheet.routes.ts";
import { UserRouter } from "./user.routes.ts";

const router = Router();

router.use("/businesses", BusinessRouter);
router.use("/employees", EmployeeRouter);
router.use("/employeeUnavailabilities", EmployeeUnavailabilityRouter);
router.use("/permissionRoles", PermissionRoleRouter);
router.use("/roles", RoleRouter);
router.use("/scheduleTemplates", ScheduleTemplateRouter);
router.use("/settings", SettingsRouter);
router.use("/shifts", ShiftRouter);
router.use("/shiftOfferRequests", ShiftOfferRequestRouter);
router.use("/shiftTemplates", ShiftTemplateRouter);
router.use("/shiftTradeRequests", ShiftTradeRequestRouter);
router.use("/employees", EmployeeRouter);
router.use("/tasks", TaskRouter);
router.use("/taskLists", TaskListRouter);
router.use("/timeOffRequests", TimeOffRequestRouter);
router.use("/timeSheets", TimeSheetRouter);
router.use("/users", UserRouter);

export { router };
