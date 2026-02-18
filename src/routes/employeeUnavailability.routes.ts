import { Router } from "express";
import employeeUnavailabilityController from "../controllers/employeeUnavailability.controller.ts";

const router = Router();

router.post("/", employeeUnavailabilityController.create);
router.put("/", employeeUnavailabilityController.update);
router.delete("/:id", employeeUnavailabilityController.delete);
router.get("/:id", employeeUnavailabilityController.find);

export default router;
