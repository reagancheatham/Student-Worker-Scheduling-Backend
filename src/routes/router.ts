import { Router } from "express";
import { BusinessRouter } from "./business.routes.ts";
import { EmployeeRouter } from "./employee.routes.ts";
import { ScheduleTemplateRouter } from "./scheduleTemplate.routes.ts";
import { TaskListRouter } from "./taskList.routes.ts";
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

export { router };