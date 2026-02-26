import { Router } from "express";

export abstract class ModelRouter {
    public abstract path(): string;

    public router(): Router {
        const router = Router();

        this.buildRouter(router);

        return router;
    }

    protected abstract buildRouter(router: Router): void;
}
