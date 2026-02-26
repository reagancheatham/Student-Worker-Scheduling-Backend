import { Router } from "express";
import { ShiftOfferRequestRouter } from "./shiftOfferRequest.routes.ts";
import { ShiftTradeRequestRouter } from "./shiftTradeRequest.routes.ts";
import { TaskRouter } from "./task.routes.ts";
import { TaskListRouter } from "./taskList.routes.ts";
import { TimeOffRequestRouter } from "./timeOffRequest.routes.ts";
import { TimeSheetRouter } from "./timeSheet.routes.ts";
import { TaskListTemplateRouter } from "./taskListTemplate.routes.ts";
import { TaskTemplateRouter } from "./taskTemplate.routes.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { businessRouter } from "../models/business.ts";
import { employeeRouter } from "../models/employee.ts";
import { userRouter } from "../models/user.model.ts";
import { managerRouter } from "../models/manager.ts";
import { employeeUnavailabilityRouter } from "../models/employeeUnavailability.ts";
import { permissionRoleRouter } from "../models/permissionRole.ts";
import { roleRouter } from "../models/role.ts";
import { scheduleShiftTemplateRouter } from "../models/scheduleShiftTemplate.ts";
import { scheduleTemplateRouter } from "../models/scheduleTemplate.ts";
import { sessionRouter } from "../models/session.ts";
import { settingsRouter } from "../models/settings.ts";
import { shiftRouter } from "../models/shift.model.ts";

const router = Router();
const modelRouters: ModelRouter[] = [
    userRouter,
    businessRouter,
    managerRouter,
    employeeRouter,
    employeeUnavailabilityRouter,
    permissionRoleRouter,
    roleRouter,
    scheduleShiftTemplateRouter,
    scheduleTemplateRouter,
    sessionRouter,
    settingsRouter,
    shiftRouter,
];

modelRouters.forEach((modelRouter) => {
    router.use(modelRouter.path(), modelRouter.router());
});

router.use("/shiftOfferRequests", ShiftOfferRequestRouter);
router.use("/shiftTradeRequests", ShiftTradeRequestRouter);
router.use("/tasks", TaskRouter);
router.use("/taskLists", TaskListRouter);
router.use("/taskListTemplates", TaskListTemplateRouter);
router.use("/taskTemplates", TaskTemplateRouter);
router.use("/timeOffRequests", TimeOffRequestRouter);
router.use("/timeSheets", TimeSheetRouter);

export { router };
