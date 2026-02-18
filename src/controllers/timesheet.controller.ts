import TimeSheet from "../models/timeSheet.model.ts";
import routesUtil from "../util/routesUtil.ts";
import { Request, Response } from "express";

export default {
    async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating time sheet with info: ${JSON.stringify(info)}.`,
        );

        await TimeSheet.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created time sheet.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating time sheet: ${err}`);
            });
    },
    async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating time sheet with info: ${JSON.stringify(info)}.`,
        );

        const timeSheet = await TimeSheet.findByPk(info.id);
        if (timeSheet) {
            const updatedInfo = await timeSheet.update(info);
            routesUtil.success(
                res,
                "Successfully updated time sheet.",
                updatedInfo,
            );
        } else {
            routesUtil.error(res, "Time sheet not found.");
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting time sheet: ${id}.`);

        await TimeSheet.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted time sheet.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting time sheet: ${err}`);
            });
    },
    async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding time sheet: ${id}.`);

        const timeSheet = await TimeSheet.findByPk(Number(id))
            .then((timeSheet) => {
                routesUtil.success(
                    res,
                    `Successfully found business: ${JSON.stringify(business)}.`,
                    business,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding business: ${err}`);
            });
    },
    async getAll(req: Request, res: Response) {
        console.log(`Retrieving all businesses`);

        const businesses = await Business.findAll()
            .then((businesses) => {
                routesUtil.success(
                    res,
                    `Successfully found all businesses: ${JSON.stringify(businesses)}.`,
                    businesses,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all businesses: ${err}`);
            });
    }
};
