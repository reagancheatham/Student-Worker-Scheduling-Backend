import { Router } from "express";
import { PermissionRoleController } from "../controllers/permissionRole.controller.ts";

const PermissionRoleRouter = Router();

PermissionRoleRouter.post("/", PermissionRoleController.create);
PermissionRoleRouter.put("/", PermissionRoleController.update);
PermissionRoleRouter.delete("/:id", PermissionRoleController.delete);
PermissionRoleRouter.get("/:id", PermissionRoleController.get);

export { PermissionRoleRouter };
