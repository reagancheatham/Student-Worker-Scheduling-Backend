import { Router } from "express";
import businessController from "../controllers/business.controller.ts";

const router = Router();

router.post("/", businessController.create);
router.put("/", businessController.update);
router.delete("/:id", businessController.delete);
router.get("/:id", businessController.get);
router.get("/", businessController.getAll);

export default router;
