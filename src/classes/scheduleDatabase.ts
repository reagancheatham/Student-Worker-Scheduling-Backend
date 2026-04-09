import {
    Attributes,
    FindOptions,
    Includeable,
    Model,
    ModelStatic,
} from "sequelize";
import type { Request, Response } from "express";

export class ScheduleDatabase {
    public static async create<M extends Model>(
        model: ModelStatic<M>,
        req: Request,
        res: Response,
    ): Promise<M | undefined> {
        const info = req.body;

        if (info === null) {
            console.error(`Error creating ${model.name}: info is null`);
            return Promise.resolve(undefined);
        }

        console.log(
            `Creating ${model.name} with info: ${JSON.stringify(info)}`,
        );

        try {
            const data = await model.create(info);

            console.log(`Successfully created ${model.name}`);
            res.status(200).send(data);

            return data;
        } catch (error: any) {
            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = error.errors.map((error: any) => error.path);
                res.status(409).send({
                    message: `${fields.join(", ")} must be unique`,
                });
            }

            console.error(`Error creating ${model.name}: ${error}`);
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

        try {
            const result = await model.update(info, { where });

            if (result[0] === 0)
                console.log(`Could not find a ${model.name} to update`);
            else console.log(`Updated ${result[0]} ${model.name}s`);

            res.status(200).send({ affectedCount: result[0] });
        } catch (error: any) {
            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = error.errors.map((error: any) => error.path);

                res.status(409).send({
                    message: `${fields.join(", ")} must be unique`,
                });
            }

            console.error(`Error updating ${model.name}: ${error}`);
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
    ): Promise<M | undefined> {
        const where: any = {};

        keys.forEach((key) => {
            where[key as string] = req.params[key as string];
        });

        console.log(
            `Getting ${model.name} with info: ${JSON.stringify(where)}`,
        );

        try {
            const result = await model.findOne({ where });

            console.log(`Found ${model.name}: ${JSON.stringify(result)}`);
            res.status(200).send(result);

            if (result) return result;
        } catch (error: any) {
            console.error(`Error getting ${model.name}: ${error}`);
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

        console.log(
            `Getting ${model.name} with info: ${JSON.stringify(options)}`,
        );

        try {
            const result = await model.findOne(options);

            console.log(`Found ${model.name}: ${JSON.stringify(result)}`);
            res.status(200).send(result);

            if (result) return result;
        } catch (error: any) {
            console.error(`Error getting ${model.name}: ${error}`);
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

            console.log(`Found ${result.length} ${model.name}s`);
            res.status(200).send(result);

            return result;
        } catch (error: any) {
            console.error(`Error getting ${model.name}s: ${error}`);
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

        console.log(`Getting ${model.name} with info: `, options);

        try {
            const result = await model.findAll(options);
            console.log(`Found ${result.length} ${model.name}s`);
            console.log("result: " + JSON.stringify(result));

            res.status(200).send(result);

            return result;
        } catch (error: any) {
            console.error(`Error getting all ${model.name}s: ${error}`);
            res.status(500).send({ error });
        }
    }
}
