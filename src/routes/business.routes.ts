import { Router } from "express";
import { BusinessController } from "../controllers/business.controller.ts";

const BusinessRouter = Router();

BusinessRouter.post("/", BusinessController.create);
BusinessRouter.put("/", BusinessController.update);
BusinessRouter.delete("/:id", BusinessController.delete);
BusinessRouter.get("/:id", BusinessController.get);
BusinessRouter.get("/", BusinessController.getAll);

export { BusinessRouter };
