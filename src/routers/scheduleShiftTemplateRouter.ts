import { Request, Router } from "express";
import {
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { ScheduleShiftTemplate } from "../models/scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "../models/scheduleTemplate.ts";
import { ShiftTaskListTemplate } from "../models/shiftTaskListTemplate.ts";
import { ShiftTaskTemplate } from "../models/shiftTaskTemplate.ts";
import { Employee } from "../models/employee.ts";
import { User } from "../models/user.ts";
import { Role } from "../models/role.ts";

const idResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    try {
        const scheduleShiftTemplate = await ScheduleShiftTemplate.findOne({
            where: { id },
            include: [
                {
                    model: ScheduleTemplate,
                    attributes: ["businessID"],
                },
            ],
        });

        return (scheduleShiftTemplate as any)?.ScheduleTemplate?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${ScheduleShiftTemplate.name}: ${error}`);
        return undefined;
    }
};

const scheduleTemplateIDResolver: IDResolver = async (req: Request) => {
    let scheduleTemplateID = req.params?.scheduleTemplateID;

    if (!scheduleTemplateID) scheduleTemplateID = req.body?.scheduleTemplateID;
    if (!scheduleTemplateID) return undefined;

    try {
        const template = await ScheduleTemplate.findOne({
            where: { id: scheduleTemplateID },
        });

        return template?.businessID;
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
        router.post("/", managerAuth(scheduleTemplateIDResolver), (req, res) =>
            ScheduleDatabase.create(ScheduleShiftTemplate, req, res),
        );
        router.put("/", managerAuth(scheduleTemplateIDResolver), (req, res) =>
            ScheduleDatabase.update(ScheduleShiftTemplate, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(ScheduleShiftTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.getWhere(
                ScheduleShiftTemplate,
                req,
                res,
                {
                    include: [
                        ShiftTaskListTemplate,
                        {
                            model: Employee,
                            include: [
                                User,
                                {
                                    model: Role,
                                    through: { attributes: [] },
                                },
                            ],
                        },
                        Role,
                    ],
                },
                "id",
            ),
        );
        router.get(
            "/template/:scheduleTemplateID",
            managerAuth(scheduleTemplateIDResolver),
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
                            {
                                model: Employee,
                                include: [
                                    User,
                                    {
                                        model: Role,
                                        through: { attributes: [] },
                                    },
                                ],
                            },
                            Role,
                        ],
                    },
                    "scheduleTemplateID",
                ),
        );
    }
}

export const scheduleShiftTemplateRouter = new ScheduleShiftTemplateRouter();
