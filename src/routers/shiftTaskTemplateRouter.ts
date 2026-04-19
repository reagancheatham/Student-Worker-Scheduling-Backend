import { Request, Router } from "express";
import { IDResolver, managerAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { ScheduleShiftTemplate } from "../models/scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "../models/scheduleTemplate.ts";
import { ShiftTaskListTemplate } from "../models/shiftTaskListTemplate.ts";
import { ShiftTaskTemplate } from "../models/shiftTaskTemplate.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const template = await ShiftTaskTemplate.findOne({
        where: { id },
        include: [
            {
                model: ShiftTaskListTemplate,
                include: [
                    {
                        model: ScheduleShiftTemplate,
                        include: [
                            {
                                model: ScheduleTemplate,
                                attributes: ["businessID"],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return (template as any)?.ShiftTaskListTemplate?.ScheduleShiftTemplate
        ?.ScheduleTemplate?.businessID;
};

const shiftTaskListIDResolver: IDResolver = async (req: Request) => {
    let shiftTaskListID = req.params?.shiftTaskListID;

    if (!shiftTaskListID) shiftTaskListID = req.body?.shiftTaskListID;

    if (!shiftTaskListID) return undefined;

    try {
        const taskList = await ShiftTaskListTemplate.findOne({
            where: { id: shiftTaskListID },
        });

        if (!taskList) return undefined;

        const shift = await ScheduleShiftTemplate.findOne({
            where: { id: taskList.scheduleShiftID },
        });

        if (!shift) return undefined;

        const scheduleTemplateID = shift.scheduleTemplateID;
        const schedule = await ScheduleTemplate.findOne({
            where: { id: scheduleTemplateID },
        });

        return schedule?.businessID;
    } catch (error) {
        Logger.error(`Error fetching ${ScheduleTemplate.name}.`);
        return undefined;
    }
};

class ShiftTaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/shiftTaskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(shiftTaskListIDResolver), (req, res) =>
            ScheduleDatabase.create(ShiftTaskTemplate, req, res),
        );
        router.put("/", managerAuth(shiftTaskListIDResolver), (req, res) =>
            ScheduleDatabase.update(ShiftTaskTemplate, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(ShiftTaskTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(ShiftTaskTemplate, req, res, "id"),
        );
        router.get(
            "/shiftTaskList/:shiftTaskListID",
            managerAuth(shiftTaskListIDResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    ShiftTaskTemplate,
                    req,
                    res,
                    {},
                    "shiftTaskListID",
                ),
        );
    }

    public async createOrUpdateTask(
        task: ShiftTaskTemplate,
        listOrder: number,
    ): Promise<void> {
        let id = task.id;
        task.listOrder = listOrder;

        if (task.id > 0)
            await ShiftTaskTemplate.update(task, { where: { id } });
        else {
            let taskInstance = await ShiftTaskTemplate.create(task);
            id = taskInstance.id;
        }
    }
}

export const shiftTaskTemplateRouter = new ShiftTaskTemplateRouter();
