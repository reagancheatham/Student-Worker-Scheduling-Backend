import { Request, Response, Router } from "express";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { ScheduleShiftTemplate } from "../models/scheduleShiftTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleTemplate } from "../models/scheduleTemplate.ts";
import { Logger } from "../classes/util/logger.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftTaskListTemplate } from "../models/shiftTaskListTemplate.ts";
import {
    ShiftTaskTemplate,
    shiftTaskTemplateRouter,
} from "../models/shiftTaskTemplate.ts";

const resolver: BusinessResolver = async (req: Request) => {
    let scheduleShiftID = req.params?.scheduleShiftID;

    if (!scheduleShiftID) scheduleShiftID = req.body?.scheduleShiftID;

    if (!scheduleShiftID) return undefined;

    try {
        const shift = await ScheduleShiftTemplate.findOne({
            where: { id: scheduleShiftID },
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

class ShiftTaskListTemplateRouter extends ModelRouter {
    public path(): string {
        return "/shiftTaskListTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post(
            "/",
            businessAuth(resolver),
            ShiftTaskListTemplateRouter.createTaskList,
        );
        router.put(
            "/",
            businessAuth(resolver),
            ShiftTaskListTemplateRouter.updateTaskList,
        );
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(ShiftTaskListTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.get(ShiftTaskListTemplate, req, res, "id"),
        );
        router.get(
            "/scheduleShiftTemplate/:scheduleShiftID",
            businessAuth(resolver),
            ShiftTaskListTemplateRouter.getOrCreateForShiftTemplate,
        );
    }

    private static async createTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(
                `Error updating ${ShiftTaskListTemplate.name}: info is null`,
            );
            return Promise.resolve();
        }

        Logger.log(
            `Creating ${ShiftTaskListTemplate.name} with info: ${JSON.stringify(info)}`,
        );

        try {
            const list = await ShiftTaskListTemplate.create(info);
            const tasks = info.shiftTaskTemplates as ShiftTaskTemplate[];

            tasks.forEach((task) => {
                task.shiftTaskListID = list.id;
            });

            await ShiftTaskListTemplateRouter.updateTaskListTasks(tasks);
            res.status(200).send(list);
        } catch (error) {
            Logger.error(
                `Error creating ${ShiftTaskListTemplate.name}: ${error}`,
            );
            res.status(500).send({ error });
        }
    }

    private static async updateTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(
                `Error updating ${ShiftTaskListTemplate.name}: info is null`,
            );
            return Promise.resolve();
        }

        Logger.log(
            `Updating ${ShiftTaskListTemplate.name} with info: ${JSON.stringify(info)}`,
        );

        const id = info.id;
        const tasks = info.shiftTaskTemplates as ShiftTaskTemplate[];

        try {
            const result = await ShiftTaskListTemplate.update(info, {
                where: {
                    id,
                },
            });

            if (result[0] === 0)
                Logger.log(
                    `Could not find a ${ShiftTaskListTemplate.name} to update`,
                );
            else
                Logger.log(
                    `Updated ${result[0]} ${ShiftTaskListTemplate.name}s`,
                );

            await ShiftTaskListTemplateRouter.updateTaskListTasks(tasks);

            res.status(200).send({ affectedCount: result[0] });
        } catch (error) {
            Logger.error(
                `Error updating ${ShiftTaskListTemplate.name}: ${error}`,
            );
            res.status(500).send({ error });
        }
    }

    private static async updateTaskListTasks(tasks: ShiftTaskTemplate[]) {
        if (!tasks || tasks.length === 0) return Promise.resolve();

        Logger.log(`Updating ${ShiftTaskListTemplate.name} tasks`);

        const promises = tasks.map(async (task, index) => {
            await shiftTaskTemplateRouter.createOrUpdateTask(task, index);
        });

        await Promise.all(promises);
    }

    private static async getOrCreateForShiftTemplate(
        req: Request,
        res: Response,
    ) {
        try {
            const response = await ShiftTaskListTemplate.findOrCreate({
                where: req.params,
                defaults: {
                    scheduleShiftID: Number(req.params.shiftID),
                    name: "Task List",
                },
                include: ShiftTaskTemplate,
            });

            const taskList = response[0];
            Logger.log(
                `Successfully found/created ${ShiftTaskListTemplate.name}`,
            );

            res.status(200).send(taskList);
        } catch (error) {
            Logger.error(
                `Error creating ${ShiftTaskListTemplate.name}: ${error}`,
            );
            res.status(500).send({ error });
        }
    }
}

export const shiftTaskListTemplateRouter = new ShiftTaskListTemplateRouter();
