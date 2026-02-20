import { Router } from "express";
import settingController from "../controllers/setting.controller.ts";

const SettingRouter = Router();

SettingRouter.post("/", settingController.create);
SettingRouter.put("/", settingController.update);
SettingRouter.delete("/:id", settingController.delete);
SettingRouter.get("/:id", settingController.find);

export { SettingRouter };
