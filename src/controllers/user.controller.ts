import { User } from "../models/user.model.ts";
import routesUtil from "../util/routesUtil.ts";
import type { Request, Response } from "express";

export default {
    async create(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Creating user with info: ${JSON.stringify(info)}.`,
        );

        await User.create(info)
            .then((data) => {
                routesUtil.success(res, "Successfully created user.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating user: ${err}`);
            });
    },
    async update(req: Request, res: Response) {
        const info = req.body;

        console.log(
            `Updating user with info: ${JSON.stringify(info)}.`,
        );

        const user = await User.findByPk(info.id);
        if (user) {
            const updatedUser = await user.update(info);
            routesUtil.success(
                res,
                "Successfully updated user.",
                updatedUser,
            );
        } else {
            routesUtil.error(res, "User not found.");
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Deleting user: ${id}.`);

        await User.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted user.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting user: ${err}`);
            });
    },
    async get(req: Request, res: Response) {
        const id = req.params.id;

        console.log(`Finding user: ${id}.`);

        const user = await User.findByPk(Number(id))
            .then((user) => {
                routesUtil.success(
                    res,
                    `Successfully found user: ${JSON.stringify(user)}.`,
                    user,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding user: ${err}`);
            });
    },
    async getAll(req: Request, res: Response) {
        console.log(`Retrieving all useres`);

        const user = await User.findAll()
            .then((user) => {
                routesUtil.success(
                    res,
                    `Successfully found all users: ${JSON.stringify(user)}.`,
                    user,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding all users: ${err}`);
            });
    }
};
