import { Router } from "express";
import { SettingController } from "../controllers/setting.controllet.ts";

const SettingRouter = Router();

SettingRouter.post("/", SettingController.create);
SettingRouter.put("/", SettingController.update);
SettingRouter.delete("/:id", SettingController.delete);
SettingRouter.get("/:id", SettingController.get);

export { SettingRouter };
