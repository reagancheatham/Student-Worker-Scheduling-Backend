import { Router } from "express";
import { ModelRouter } from "./classes/databaseModel.ts";
import { businessRouter } from "./models/business.ts";
import { employeeRouter } from "./models/employee.ts";
import { userRouter } from "./models/user.ts";
import { businessPermissionRoleRouter } from "./models/businessPermissionRole.ts";
import { employeeUnavailabilityRouter } from "./models/employeeUnavailability.ts";
import { permissionRoleRouter } from "./models/permissionRole.ts";
import { roleRouter } from "./models/role.ts";
import { scheduleShiftTemplateRouter } from "./models/scheduleShiftTemplate.ts";
import { scheduleTemplateRouter } from "./models/scheduleTemplate.ts";
import { sessionRouter } from "./models/session.ts";
import { settingsRouter } from "./models/settings.ts";
import { shiftRouter } from "./models/shift.ts";
import { shiftOfferRequestRouter } from "./models/shiftOfferRequest.ts";
import { shiftTaskListTemplateRouter } from "./models/shiftTaskListTemplate.ts";
import { shiftTaskTemplateRouter } from "./models/shiftTaskTemplate.ts";
import { shiftTradeRequestRouter } from "./models/shiftTradeRequest.ts";
import { taskRouter } from "./routers/taskRouter.ts"
import { taskCheckOffRouter } from "./models/taskCheckOff.ts";
import { taskListRouter } from "./routers/taskListRouter.ts";
import { taskListTemplateRouter } from "./models/taskListTemplate.ts";
import { taskTemplateRouter } from "./models/taskTemplate.ts";
import { timeOffRequestRouter } from "./models/timeOffRequest.ts";
import { timesheetRouter } from "./models/timesheet.ts";
import { Authentication, authenticationRouter } from "./authentication.ts";
import { inviteRouter } from "./models/invite.ts";

const router = Router();
const modelRouters: ModelRouter[] = [
    userRouter,
    businessRouter,
    businessPermissionRoleRouter,
    employeeRouter,
    employeeUnavailabilityRouter,
    permissionRoleRouter,
    roleRouter,
    scheduleShiftTemplateRouter,
    scheduleTemplateRouter,
    sessionRouter,
    settingsRouter,
    shiftRouter,
    shiftOfferRequestRouter,
    shiftTaskListTemplateRouter,
    shiftTaskTemplateRouter,
    shiftTradeRequestRouter,
    taskRouter,
    taskCheckOffRouter,
    taskListRouter,
    taskListTemplateRouter,
    taskTemplateRouter,
    timeOffRequestRouter,
    timesheetRouter,
    inviteRouter,
];

router.use(authenticationRouter.path(), authenticationRouter.router());
router.use(Authentication.validateSession);

modelRouters.forEach((modelRouter) => {
    router.use(modelRouter.path(), modelRouter.router());
});

export { router };
