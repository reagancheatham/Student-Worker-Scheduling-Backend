import { Task } from "../models/task.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export class TaskController {
    static async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating task with info: ${JSON.stringify(info)}.`,
        );

        await Task.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created task.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating task: ${err}`);
            });
    }
    static async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating task with info: ${JSON.stringify(info)}.`,
        );

        const task = await Task.findByPk(info.id);
        if (task) {
            const updatedTask = await task.update(info);
            routesUtil.success(
                res,
                "Successfully updated task.",
                updatedTask,
            );
        } else {
            routesUtil.error(res, "Task not found.");
        }
    }
    static async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting task: ${id}.`);

        await Task.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted task.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting task: ${err}`);
            });
    }
    static async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding task: ${id}.`);

        const task = await Task.findByPk(Number(id))
            .then((task) => {
                routesUtil.success(
                    res,
                    `Successfully found task: ${JSON.stringify(task)}.`,
                    task,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding task: ${err}`);
            });
    }
    static async getAll(req: Request, res: Response) {
        console.log(`Retrieving all taskes`);

        const task = await Task.findAll()
            .then((task) => {
                routesUtil.success(
                    res,
                    `Successfully found all tasks: ${JSON.stringify(task)}.`,
                    task,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all tasks: ${err}`);
            });
    }
};
