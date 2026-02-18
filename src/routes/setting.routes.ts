import { Router } from "express";
import settingController from "../controllers/setting.controller.ts";

const router = Router();

router.post("/", settingController.create);
router.put("/", settingController.update);
router.delete("/:id", settingController.delete);
router.get("/:id", settingController.find);

export default router;
