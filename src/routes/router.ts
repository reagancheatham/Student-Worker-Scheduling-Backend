import { Router } from "express";
import businessRouters from "./business.routes.ts"
const router = Router();

router.use((req, res, next) => {
    console.log("router received request " + req.url);

    next();
});

router.use("/businesses", businessRouters);

export default router;