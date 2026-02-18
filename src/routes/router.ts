import { Router } from "express";
import businessRouters from "./business.routes.ts";
import scheduleTemplateRouters from "./scheduleTemplate.routes.ts"
import userRouters from "./user.routes.ts";
import taskListRouters from "./taskList.routes.ts"
const router = Router();

router.use((req, res, next) => {
    console.log("router received request " + req.url);

    next();
});

router.use("/business", businessRouters);
router.use("/user", userRouters);
router.use("/scheduleTemplate", scheduleTemplateRouters);
router.use("/taskList", taskListRouters);

export default router;