import { Request, Router } from "express";
import { IDResolver, managerAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { ScheduleTemplate } from "../models/scheduleTemplate.ts";

const resolver: IDResolver = async (req: Request) => {
    const id = req.params.id;

    if (!id) return undefined;

    try {
        const scheduleTemplate = await ScheduleTemplate.findOne({
            where: { id },
        });

        if (!scheduleTemplate) return undefined;
        else return scheduleTemplate.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${ScheduleTemplate.name}: ${error}`);
        return undefined;
    }
};

class ScheduleTemplateRouter extends ModelRouter {
    public path(): string {
        return "/scheduleTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(ScheduleTemplate, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(ScheduleTemplate, req, res, "id"),
        );
        router.delete("/:id", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(ScheduleTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.get(ScheduleTemplate, req, res, "id"),
        );
        router.get("/business/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(ScheduleTemplate, req, res, {}),
        );
    }
}

export const scheduleTemplateRouter = new ScheduleTemplateRouter();
