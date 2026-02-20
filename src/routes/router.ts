import { Router } from "express";
import { BusinessRouter } from "./business.routes.ts";
import { EmployeeRouter } from "./employee.routes.ts";
import { EmployeeUnavailabilityRouter } from "./employeeUnavailability.routes.ts";
import { PermissionRoleRouter } from "./permissionRole.routes.ts";
import { RoleRouter } from "./role.routes.ts";
import { ScheduleTemplateRouter } from "./scheduleTemplate.routes.ts";
import { SettingRouter } from "./setting.routes.ts"
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

router.use((req, res, next) => {
    console.log("router received request " + req.url);

    next();
});

router.use("/business", BusinessRouter);
router.use("/user", UserRouter);
router.use("/scheduleTemplate", ScheduleTemplateRouter);
router.use("/taskList", TaskListRouter);
router.use("/employee", EmployeeRouter);
router.use("/timeSheet", TimeSheetRouter);
router.use("/task", TaskRouter);

export { router };