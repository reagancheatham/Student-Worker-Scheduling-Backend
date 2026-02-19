import TimeSheet from "../models/timeSheet.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export class TimeSheetController {
    static async create(req: Request, res: Response) {
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
    }
    static async update(req: Request, res: Response) {
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
    }
    static async delete(req: Request, res: Response) {
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
    }
    static async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding time sheet: ${id}.`);

        const timeSheet = await TimeSheet.findByPk(Number(id))
            .then((timeSheet) => {
                routesUtil.success(
                    res,
                    `Successfully found time sheet: ${JSON.stringify(timeSheet)}.`,
                    timeSheet,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding time sheet: ${err}`);
            });
    }
    static async getAll(req: Request, res: Response) {
        console.log(`Retrieving all time sheets`);

        const timeSheets = await TimeSheet.findAll()
            .then((timeSheets) => {
                routesUtil.success(
                    res,
                    `Successfully found all time sheets: ${JSON.stringify(timeSheets)}.`,
                    timeSheets,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all time sheets: ${err}`);
            });
    }
};
