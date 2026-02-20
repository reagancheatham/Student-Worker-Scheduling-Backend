import { Router } from "express";
import roleController from "../controllers/role.controller.ts";

const RoleRouter = Router();

RoleRouter.post("/", roleController.create);
RoleRouter.put("/", roleController.update);
RoleRouter.delete("/:id", roleController.delete);
RoleRouter.get("/:id", roleController.find);

export { RoleRouter };
