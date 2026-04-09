import { RequestHandler, Router } from "express";

export abstract class ModelRouter {
    public abstract path(): string;

    public router(...handlers: RequestHandler<{}, any, any, {}, Record<string, any>>[]): Router {
        const router = Router();

        handlers.forEach((handler) => router.use(handler));
        this.buildRouter(router);

        return router;
    }

    protected abstract buildRouter(router: Router): void;
}
