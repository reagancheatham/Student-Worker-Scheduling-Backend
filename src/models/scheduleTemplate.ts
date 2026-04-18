import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";

export class ScheduleTemplate extends Model<
    InferAttributes<ScheduleTemplate>,
    InferCreationAttributes<ScheduleTemplate>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare name: string;
}

ScheduleTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["id", "businessID", "name"],
            },
        ],
    },
);

const resolver: BusinessResolver = async (req: Request) => {
    const id = req.params.id;

    if (!id) return undefined;

    try {
        const scheduleTemplate = await ScheduleTemplate.findOne({
            where: { id },
        });

        if (!scheduleTemplate) return undefined;
        else return scheduleTemplate.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${ScheduleTemplate.name}: ${error}`);
        return undefined;
    }
};

class ScheduleTemplateRouter extends ModelRouter {
    public path(): string {
        return "/scheduleTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(), (req, res) =>
            ScheduleDatabase.create(ScheduleTemplate, req, res),
        );
        router.put("/", businessAuth(), (req, res) =>
            ScheduleDatabase.update(ScheduleTemplate, req, res, "id"),
        );
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(ScheduleTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.get(ScheduleTemplate, req, res, "id"),
        );
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(ScheduleTemplate, req, res, {}),
        );
    }
}

export const scheduleTemplateRouter = new ScheduleTemplateRouter();
