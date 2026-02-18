import { ScheduleTemplate } from "../models/scheduleTemplate.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export default {
    async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating scheduleTemplate with info: ${JSON.stringify(info)}.`,
        );

        await ScheduleTemplate.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created scheduleTemplate.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating scheduleTemplate: ${err}`);
            });
    },
    async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating scheduleTemplate with info: ${JSON.stringify(info)}.`,
        );

        const scheduleTemplate = await ScheduleTemplate.findByPk(info.id);
        if (scheduleTemplate) {
            const updatedScheduleTemplate = await scheduleTemplate.update(info);
            routesUtil.success(
                res,
                "Successfully updated scheduleTemplate.",
                updatedScheduleTemplate,
            );
        } else {
            routesUtil.error(res, "ScheduleTemplate not found.");
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting scheduleTemplate: ${id}.`);

        await ScheduleTemplate.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted scheduleTemplate.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting scheduleTemplate: ${err}`);
            });
    },
    async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding scheduleTemplate: ${id}.`);

        const scheduleTemplate = await ScheduleTemplate.findByPk(Number(id))
            .then((scheduleTemplate) => {
                routesUtil.success(
                    res,
                    `Successfully found scheduleTemplate: ${JSON.stringify(scheduleTemplate)}.`,
                    scheduleTemplate,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding scheduleTemplate: ${err}`);
            });
    },
    async getAll(req: Request, res: Response) {
        console.log(`Retrieving all businesses`);

        const scheduleTemplate = await ScheduleTemplate.findAll()
            .then((scheduleTemplate) => {
                routesUtil.success(
                    res,
                    `Successfully found all businesses: ${JSON.stringify(scheduleTemplate)}.`,
                    scheduleTemplate,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all businesses: ${err}`);
            });
    }
};
