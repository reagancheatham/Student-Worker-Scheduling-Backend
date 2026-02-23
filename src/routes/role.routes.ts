import { Router } from "express";
import { RoleController } from "../controllers/role.controller.ts";

const RoleRouter = Router();

RoleRouter.post("/", RoleController.create);
RoleRouter.put("/", RoleController.update);
RoleRouter.delete("/:id", RoleController.delete);
RoleRouter.get("/:id", RoleController.get);
RoleRouter.get("/:businessID/:id", RoleController.getForBusiness);

export { RoleRouter };
