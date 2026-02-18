import { Router } from "express";
import businessRouters from "./business.routes.ts"
import timeSheetRouters from "./timeSheet.routes.ts"
const router = Router();

router.use((req, res, next) => {
    console.log("router received request " + req.url);

    next();
});

router.use("/business", businessRouters);
router.use("/timeSheet", timeSheetRouters);

export default router;