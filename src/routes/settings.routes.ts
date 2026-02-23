import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.ts";

const SettingsRouter = Router();

SettingsRouter.post("/", SettingsController.create);
SettingsRouter.put("/", SettingsController.update);
SettingsRouter.delete("/:id", SettingsController.delete);
SettingsRouter.get("/:id", SettingsController.get);

export { SettingsRouter };
