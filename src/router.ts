import { Response, Request, Router, NextFunction } from "express";
import { ModelRouter } from "./classes/databaseModel.ts";
import { businessRouter } from "./models/business.ts";
import { scheduleShiftTemplateRouter } from "./routers/scheduleShiftTemplateRouter.ts";
import { shiftTaskListTemplateRouter } from "./routers/shiftTaskListTemplateRouter.ts";
import { taskRouter } from "./routers/taskRouter.ts";
import { taskListRouter } from "./routers/taskListRouter.ts";
import { Authentication, authenticationRouter } from "./authentication.ts";
import { userRouter } from "./routers/userRouter.ts";
import { businessPermissionRoleRouter } from "./routers/businessPermissionRoleRouter.ts";
import { permissionRoleRouter } from "./routers/permissionRoleRouter.ts";
import { sessionRouter } from "./routers/sessionRouter.ts";
import { inviteRouter } from "./routers/inviteRouter.ts";
import { employeeRouter } from "./routers/employeeRouter.ts";
import { employeeUnavailabilityRouter } from "./routers/employeeUnavailabilityRouter.ts";
import { roleRouter } from "./routers/roleRouter.ts";
import { scheduleTemplateRouter } from "./routers/scheduleTemplateRouter.ts";
import { settingsRouter } from "./routers/settingsRouter.ts";
import { shiftOfferRequestRouter } from "./routers/shiftOfferRequestRouter.ts";
import { shiftRouter } from "./routers/shiftRouter.ts";
import { shiftTaskTemplateRouter } from "./routers/shiftTaskTemplateRouter.ts";
import { shiftTradeRequestRouter } from "./routers/shiftTradeRequestRouter.ts";
import { taskCheckOffRouter } from "./routers/taskCheckOffRouter.ts";
import { taskListTemplateRouter } from "./routers/taskListTemplateRouter.ts";
import { taskTemplateRouter } from "./routers/taskTemplateRouter.ts";
import { timeOffRequestRouter } from "./routers/timeOffRequestRouter.ts";
import { timesheetRouter } from "./routers/timesheetRouter.ts";
import { Logger } from "./classes/util/logger.ts";
import { messageNotificationRouter } from "./routers/messageNotificationRouter.ts";
import { shiftOfferRequestNotificationRouter } from "./routers/shiftOfferRequestNotificationRouter.ts";
import { shiftTradeRequestNotificationRouter } from "./routers/shiftTradeRequestNotificationRouter.ts";
import { timeOffRequestNotificationRouter } from "./routers/timeOffRequestNotificationRouter.ts";
import { employeeRoleRouter } from "./routers/employeeRoleRouter.ts";

const router = Router();
const modelRouters: ModelRouter[] = [
    userRouter,
    businessPermissionRoleRouter,
    permissionRoleRouter,
    sessionRouter,
    inviteRouter,
    businessRouter,
    employeeRouter,
    employeeRoleRouter,
    employeeUnavailabilityRouter,
    roleRouter,
    scheduleShiftTemplateRouter,
    scheduleTemplateRouter,
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
    authenticationRouter,
    inviteRouter,
    messageNotificationRouter,
    shiftOfferRequestNotificationRouter,
    shiftTradeRequestNotificationRouter,
    timeOffRequestNotificationRouter,
];

router.use(authenticationRouter.path(), authenticationRouter.router());
router.use(Authentication.validateSession);

modelRouters.forEach((modelRouter) => {
    router.use(modelRouter.path(), modelRouter.router());
});

export { router };
