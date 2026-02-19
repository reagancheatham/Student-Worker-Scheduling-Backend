import { Router } from "express";
import permissionRoleController from "../controllers/permissionRole.controller.ts";

const router = Router();

router.post("/", permissionRoleController.create);
router.put("/", permissionRoleController.update);
router.delete("/:id", permissionRoleController.delete);
router.get("/:id", permissionRoleController.find);

export default router;
