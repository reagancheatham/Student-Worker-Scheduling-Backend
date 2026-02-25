import { Attributes, Model, ModelStatic, WhereOptions } from "sequelize";
import type { Request, Response } from "express";

export class ControllerUtil {
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
        req: Request<{}, {}, Attributes<M>>,
        res: Response,
        key: keyof Attributes<M>,
    ) {
        const info = req.body;

        if (!info) {
            console.error(`Error updating ${model.name}: info is null`);
            return Promise.resolve();
        }

        console.log(
            `Updating ${model.name} with info: ${JSON.stringify(info)}`,
        );

        const where: WhereOptions<Attributes<M>> = {};
        where[key] = info[key];

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
        key: keyof Attributes<M>,
    ) {
        const id = req.params[key as string];

        console.log(`Deleting ${model.name}: ${id}`);

        await model
            .destroy({
                where: {
                    [key]: id,
                } as any,
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
        key: keyof Attributes<M>,
    ) {
        const id = req.params[key as string];

        console.log(`Getting ${model.name} with id: ${JSON.stringify(id)}`);

        await model
            .findOne({
                where: {
                    [key]: id,
                } as any,
            })
            .then((result) => {
                console.log(`Found ${model.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting ${model.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    public static async getTwoKeys<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
        key1: keyof Attributes<M>,
        key2: keyof Attributes<M>,
    ) {
        const id1 = req.params[key1 as string];
        const id2 = req.params[key2 as string];

        const where = {
            [key1]: id1,
            [key2]: id2,
        } as any;

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
        key: keyof Attributes<M>,
    ) {
        const id = req.params[key as string];

        console.log(`Getting ${model.name} with info: ${JSON.stringify(id)}`);

        await model
            .findAll({
                where: {
                    [key]: id,
                } as any,
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
