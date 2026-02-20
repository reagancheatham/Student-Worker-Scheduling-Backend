import { Router } from "express";
import permissionRoleController from "../controllers/permissionRole.controller.ts";

const PermissionRoleRouter = Router();

PermissionRoleRouter.post("/", permissionRoleController.create);
PermissionRoleRouter.put("/", permissionRoleController.update);
PermissionRoleRouter.delete("/:id", permissionRoleController.delete);
PermissionRoleRouter.get("/:id", permissionRoleController.find);

export { PermissionRoleRouter };
