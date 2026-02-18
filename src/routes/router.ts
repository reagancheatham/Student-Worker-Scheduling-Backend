import { Router } from "express";
import businessRouters from "./business.routes.ts"
import userRouters from "./user.routes.ts";
const router = Router();

router.use((req, res, next) => {
    console.log("router received request " + req.url);

    next();
});

router.use("/businesses", businessRouters);
router.use("/user", userRouters);

export default router;