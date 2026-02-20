import { Business } from "../models/business.model.ts";
import { RoutesUtil } from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export class BusinessController {
    static async create(req: Request, res: Response) {
        RoutesUtil.create<Business>(Business, req, res);
    }
    static async update(req: Request, res: Response) {
        RoutesUtil.update<Business, "id">(Business, req, res, "id");
    }
    static async delete(req: Request, res: Response) {
        RoutesUtil.delete<Business, "id">(Business, req, res, "id");
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
