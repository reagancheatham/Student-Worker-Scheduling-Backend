import { Router } from "express";
import { SessionController } from "../controllers/session.controller.ts";

const SessionRouter = Router();

SessionRouter.post("/", SessionController.create);
SessionRouter.put("/", SessionController.update);
SessionRouter.delete("/:id", SessionController.delete);
SessionRouter.get("/:id", SessionController.get);

export { SessionRouter };
