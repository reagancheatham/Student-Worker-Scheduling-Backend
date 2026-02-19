import { Router } from "express";
import { UserController } from "../controllers/user.controller.ts";

const UserRouter = Router();

UserRouter.post("/", UserController.create);
UserRouter.put("/", UserController.update);
UserRouter.delete("/:id", UserController.delete);
UserRouter.get("/:id", UserController.get);
UserRouter.get("/", UserController.getAll);

export { UserRouter };
