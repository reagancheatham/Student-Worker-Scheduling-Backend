import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";
import { EventColor } from "../classes/eventColor.ts";

export class ScheduleShiftTemplate extends Model<
    InferAttributes<ScheduleShiftTemplate>,
    InferCreationAttributes<ScheduleShiftTemplate>
> {
    declare id: CreationOptional<number>;
    declare scheduleTemplateID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare color: EventColor;
}

ScheduleShiftTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        scheduleTemplateID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ScheduleTemplate,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        color: {
            type: DataTypes.ENUM(...Object.values(EventColor)),
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["scheduleTemplateID", "name", "color"],
            },
        ],
        validate: {
            endAfterStart(this: ScheduleShiftTemplate) {
                if (this.endTime <= this.startTime) {
                    throw new Error("End time must be after start time");
                }
            },
        },
    },
);

const resolver: BusinessResolver = async (req: Request) => {
    const scheduleTemplateID = req.params?.scheduleTemplateID;

    if (!scheduleTemplateID) return undefined;

    try {
        const template = await ScheduleTemplate.findOne({
            where: { id: scheduleTemplateID },
        });

        if (template) return template.businessID;
        else return undefined;
    } catch (error) {
        Logger.error(
            `Error fetching ${ScheduleTemplate.name} with id: ${scheduleTemplateID}.`,
        );
        return undefined;
    }
};

class ScheduleShiftTemplateRouter extends ModelRouter {
    public path(): string {
        return "/scheduleShiftTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.create(ScheduleShiftTemplate, req, res),
        );
        router.put("/", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.update(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.get(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.get(
            "/template/:scheduleTemplateID",
            businessAuth(resolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    ScheduleShiftTemplate,
                    req,
                    res,
                    {},
                    "scheduleTemplateID",
                ),
        );
    }
}

export const scheduleShiftTemplateRouter = new ScheduleShiftTemplateRouter();
