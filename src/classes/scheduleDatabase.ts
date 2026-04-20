import {
    Attributes,
    FindOptions,
    Includeable,
    Model,
    ModelStatic,
} from "sequelize";
import type { Request, Response } from "express";
import { Logger } from "./util/logger.ts";

export class ScheduleDatabase {
    public static async create<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
    ): Promise<M | undefined> {
        const info = req.body;

        if (info === null) {
            Logger.error(`Error creating ${model.name}: info is null`);
            return Promise.resolve(undefined);
        }

        Logger.log(`Creating ${model.name} with info: ${JSON.stringify(info)}`);

        try {
            const data = await model.create(info);

            Logger.log(`Successfully created ${model.name}`);
            res.status(200).send(data);

            return data;
        } catch (error: any) {
            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = error.errors.map((error: any) => error.path);
                res.status(409).send({
                    message: `${fields.join(", ")} must be unique`,
                });
            }

            Logger.error(`Error creating ${model.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    public static async update<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ): Promise<void> {
        const info = req.body;

        if (!info) {
            Logger.error(`Error updating ${model.name}: info is null`);
            return Promise.resolve();
        }

        Logger.log(`Updating ${model.name} with info: ${JSON.stringify(info)}`);

        const where: any = {};
        keys.forEach((key) => {
            where[key as string] = info[key as string];
        });

        try {
            const result = await model.update(info, { where, returning: true });

            if (result[0] === 0 || result[0] === undefined) {
                Logger.log(`Could not find a ${model.name} to update`);
                res.status(200).send(req.body);
            } else {
                Logger.log(`Updated ${result[0]} ${model.name}s`);
                res.status(200).send(result[1][0]);
            }
        } catch (error: any) {
            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = error.errors.map((error: any) => error.path);

                res.status(409).send({
                    message: `${fields.join(", ")} must be unique`,
                });
            }

            Logger.error(`Error updating ${model.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    public static async delete<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ): Promise<void> {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        Logger.log(`Deleting ${model.name}: ${JSON.stringify(where)}`);

        try {
            await model.destroy({ where });

            Logger.log(`Successfully deleted ${model.name}`);
            res.status(200).send({});
        } catch (error: any) {
            Logger.error(`Error deleting ${model.name}: ${error}`);
            res.status(500).send({ error });
        }
        await model
            .destroy({
                where,
            })
            .then(() => {
                Logger.log(`Successfully deleted ${model.name}`);
                res.status(200).send({});
            })
            .catch((error) => {
                Logger.error(`Error deleting ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async get<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ): Promise<M | undefined> {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        Logger.log(`Getting ${model.name} with info: ${JSON.stringify(where)}`);

        try {
            const result = await model.findOne({ where });

            Logger.log(`Found ${model.name}: ${JSON.stringify(result)}`);
            res.status(200).send(result);

            if (result) return result;
        } catch (error: any) {
            Logger.error(`Error getting ${model.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    public static async getWhere<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        options: FindOptions<Attributes<M>>,
        ...keys: (keyof Attributes<M>)[]
    ): Promise<M | undefined> {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        options.where = where;

        Logger.log(
            `Getting ${model.name} with info: ${JSON.stringify(options)}`,
        );

        try {
            const result = await model.findOne(options);

            Logger.log(`Found ${model.name}: ${JSON.stringify(result)}`);
            res.status(200).send(result);

            if (result) return result;
        } catch (error: any) {
            Logger.error(`Error getting ${model.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    public static async getAll<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        include?: Includeable,
    ): Promise<M[] | undefined> {
        if (!include) include = {};

        try {
            const result = await model.findAll();

            Logger.log(`Found ${result.length} ${model.name}s`);
            res.status(200).send(result);

            return result;
        } catch (error: any) {
            Logger.error(`Error getting ${model.name}s: ${error}`);
            res.status(500).send({ error });
        }
    }

    public static async getAllWhere<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        options: FindOptions<Attributes<M>>,
        ...keys: (keyof Attributes<M>)[]
    ): Promise<M[] | undefined> {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        options.where = where;

        Logger.log(`Getting ${model.name} with info: `, options);

        try {
            const result = await model.findAll(options);
            Logger.log(`Found ${result.length} ${model.name}s`);

            res.status(200).send(result);

            return result;
        } catch (error: any) {
            Logger.error(`Error getting all ${model.name}s: ${error}`);
            res.status(500).send({ error });
        }
    }
}
