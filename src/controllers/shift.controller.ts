import Shift from "../models/shift.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";
import { Op } from "sequelize";

export default {
    async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating shift with info: ${JSON.stringify(info)}.`,
        );

        await Shift.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created shift.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating shift: ${err}`);
            });
    },
    async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating shift with info: ${JSON.stringify(info)}.`,
        );

        const shift = await Shift.findByPk(info.id);
        if (shift) {
            const updatedShift = await shift.update(info);
            routesUtil.success(
                res,
                "Successfully updated shift.",
                updatedShift,
            );
        } else {
            routesUtil.error(res, "Shift not found.");
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting shift: ${id}.`);

        await Shift.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted shift.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting shift: ${err}`);
            });
    },
    async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding shift: ${id}.`);

        const shift = await Shift.findByPk(Number(id))
            .then((shift) => {
                routesUtil.success(
                    res,
                    `Successfully found shift: ${JSON.stringify(shift)}.`,
                    shift,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding shift: ${err}`);
            });
    },
    async getAll(req: Request, res: Response) {
        console.log(`Retrieving all shiftes`);

        const shift = await Shift.findAll()
            .then((shift) => {
                routesUtil.success(
                    res,
                    `Successfully found all shiftes: ${JSON.stringify(shift)}.`,
                    shift,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all shifts: ${err}`);
            });
    }
};
