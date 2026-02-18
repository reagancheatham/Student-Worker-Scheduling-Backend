import { Router } from "express";
import employeeController from "../controllers/employee.controller.ts";

const router = Router();

router.post("/", employeeController.create);
router.put("/", employeeController.update);
router.delete("/:id", employeeController.delete);
router.get("/:id", employeeController.find);

export default router;
