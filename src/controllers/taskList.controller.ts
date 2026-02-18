import { TaskList } from "../models/taskList.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export default {
    async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating taskList with info: ${JSON.stringify(info)}.`,
        );

        await TaskList.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created taskList.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating taskList: ${err}`);
            });
    },
    async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating taskList with info: ${JSON.stringify(info)}.`,
        );

        const taskList = await TaskList.findByPk(info.id);
        if (taskList) {
            const updatedTaskList = await taskList.update(info);
            routesUtil.success(
                res,
                "Successfully updated taskList.",
                updatedTaskList,
            );
        } else {
            routesUtil.error(res, "TaskList not found.");
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting taskList: ${id}.`);

        await TaskList.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted taskList.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting taskList: ${err}`);
            });
    },
    async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding taskList: ${id}.`);

        const taskList = await TaskList.findByPk(Number(id))
            .then((taskList) => {
                routesUtil.success(
                    res,
                    `Successfully found taskList: ${JSON.stringify(taskList)}.`,
                    taskList,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding taskList: ${err}`);
            });
    },
    async getAll(req: Request, res: Response) {
        console.log(`Retrieving all taskListes`);

        const taskList = await TaskList.findAll()
            .then((taskList) => {
                routesUtil.success(
                    res,
                    `Successfully found all taskListes: ${JSON.stringify(taskList)}.`,
                    taskList,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all taskListes: ${err}`);
            });
    }
};
