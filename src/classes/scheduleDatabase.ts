import { Attributes, Model, ModelStatic } from "sequelize";
import type { Request, Response } from "express";

export class ScheduleDatabase {
    public static async create<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
    ) {
        const info = req.body;

        if (info === null) {
            console.error(`Error creating ${model.name}: info is null`);
            return Promise.resolve();
        }

        console.log(
            `Creating ${model.name} with info: ${JSON.stringify(info)}`,
        );

        await model
            .create(info)
            .then((data) => {
                console.log(`Successfully created ${model.name}`);
                res.status(200).send(data);
            })
            .catch((error) => {
                console.error(`Error creating ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async update<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ) {
        const info = req.body;

        if (!info) {
            console.error(`Error updating ${model.name}: info is null`);
            return Promise.resolve();
        }

        console.log(
            `Updating ${model.name} with info: ${JSON.stringify(info)}`,
        );

        const where: any = {};
        keys.forEach((key) => {
            where[key as string] = info[key as string];
        });

        await model
            .update(info, { where })
            .then((result) => {
                if (result[0] === 0)
                    console.log(`Could not find a ${model.name} to update`);
                else console.log(`Updated ${result[0]} ${model.name}s`);

                res.status(200).send({ affectedCount: result[0] });
            })
            .catch((error) => {
                console.error(`Error updating ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async delete<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ) {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        console.log(`Deleting ${model.name}: ${JSON.stringify(where)}`);

        await model
            .destroy({
                where,
            })
            .then(() => {
                console.log(`Successfully deleted ${model.name}`);
                res.status(200).send({});
            })
            .catch((error) => {
                console.error(`Error deleting ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async get<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        ...keys: (keyof Attributes<M>)[]
    ) {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        console.log(
            `Getting ${model.name} with info: ${JSON.stringify(where)}`,
        );

        await model
            .findOne({ where })
            .then((result) => {
                console.log(`Found ${model.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async getAll<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
    ) {
        await model
            .findAll()
            .then((result) => {
                console.log(`Found ${result.length} ${model.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting ${model.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async getAllWhere<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        keys: (keyof Attributes<M>)[] = [],
        options: any = {},
    ) {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        console.log(
            `Getting ${model.name} with info: ${JSON.stringify(where)}`,
        );

        await model
            .findAll({
                where,
                ...options
            })
            .then((result) => {
                console.log(`Found ${result.length} ${model.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting all ${model.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }
}
