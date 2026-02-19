import { Business } from "../models/business.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export class BusinessController {
    static async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating business with info: ${JSON.stringify(info)}.`,
        );

        await Business.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created business.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating business: ${err}`);
            });
    }
    static async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating business with info: ${JSON.stringify(info)}.`,
        );

        const business = await Business.findByPk(info.id);
        if (business) {
            const updatedBusiness = await business.update(info);
            routesUtil.success(
                res,
                "Successfully updated business.",
                updatedBusiness,
            );
        } else {
            routesUtil.error(res, "Business not found.");
        }
    }
    static async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting business: ${id}.`);

        await Business.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted business.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting business: ${err}`);
            });
    }
    static async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding business: ${id}.`);

        const business = await Business.findByPk(Number(id))
            .then((business) => {
                routesUtil.success(
                    res,
                    `Successfully found business: ${JSON.stringify(business)}.`,
                    business,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding business: ${err}`);
            });
    }
    static async getAll(req: Request, res: Response) {
        console.log(`Retrieving all businesses`);

        const business = await Business.findAll()
            .then((business) => {
                routesUtil.success(
                    res,
                    `Successfully found all businesses: ${JSON.stringify(business)}.`,
                    business,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all businesses: ${err}`);
            });
    }
};
