import { Request, Router } from "express";
import {
    BusinessResolver,
    businessAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { ScheduleShiftTemplate } from "../models/scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "../models/scheduleTemplate.ts";
import { ShiftTaskListTemplate } from "../models/shiftTaskListTemplate.ts";
import { ShiftTaskTemplate } from "../models/shiftTaskTemplate.ts";

const resolver: BusinessResolver = async (req: Request) => {
    let scheduleTemplateID = req.params?.scheduleTemplateID;

    if (!scheduleTemplateID) scheduleTemplateID = req.body?.scheduleTemplateID;

    if (!scheduleTemplateID) return undefined;

    try {
        const template = await ScheduleTemplate.findOne({
            where: { id: scheduleTemplateID },
        });

        if (template) return template.businessID;
        else return undefined;
    } catch (error) {
        Logger.error(
            `Error fetching ${ScheduleTemplate.name} with id: ${scheduleTemplateID}.`,
        );
        return undefined;
    }
};

class ScheduleShiftTemplateRouter extends ModelRouter {
    public path(): string {
        return "/scheduleShiftTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.create(ScheduleShiftTemplate, req, res),
        );
        router.put("/", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.update(ScheduleShiftTemplate, req, res, "id"),
        );
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(ScheduleShiftTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.getWhere(
                ScheduleShiftTemplate,
                req,
                res,
                { include: ShiftTaskListTemplate },
                "id",
            ),
        );
        router.get(
            "/template/:scheduleTemplateID",
            businessAuth(resolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    ScheduleShiftTemplate,
                    req,
                    res,
                    {
                        include: [
                            {
                                model: ShiftTaskListTemplate,
                                include: [ShiftTaskTemplate],
                            },
                        ],
                    },
                    "scheduleTemplateID",
                ),
        );
    }
}

export const scheduleShiftTemplateRouter = new ScheduleShiftTemplateRouter();
