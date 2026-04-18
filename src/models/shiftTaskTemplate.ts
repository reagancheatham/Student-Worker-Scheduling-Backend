import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { Logger } from "../classes/util/logger.ts";

export class ShiftTaskTemplate extends Model<
    InferAttributes<ShiftTaskTemplate>,
    InferCreationAttributes<ShiftTaskTemplate>
> {
    declare id: CreationOptional<number>;
    declare shiftTaskListID: number;
    declare listOrder: number;
    declare name: string;
    declare description: string;
}

ShiftTaskTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftTaskListID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ShiftTaskListTemplate,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        listOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["shiftTaskListID", "name"],
            },
        ],
    },
);

const idResolver: BusinessResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    try {
        const template = await ShiftTaskTemplate.findOne({
            where: { id },
            include: [
                {
                    model: ShiftTaskListTemplate,
                    include: [
                        {
                            model: ScheduleShiftTemplate,
                            include: [
                                {
                                    model: ScheduleTemplate,
                                    attributes: ["businessID"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return (template as any)?.ShiftTaskListTemplate?.ScheduleShiftTemplate
            ?.ScheduleTemplate?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${ShiftTaskTemplate.name}: ${error}`);
        return undefined;
    }
};

const shiftTaskListIDResolver: BusinessResolver = async (req: Request) => {
    let shiftTaskListID = req.params?.shiftTaskListID;

    if (!shiftTaskListID) shiftTaskListID = req.body?.shiftTaskListID;

    if (!shiftTaskListID) return undefined;

    try {
        const taskList = await ShiftTaskListTemplate.findOne({
            where: { id: shiftTaskListID },
        });

        if (!taskList) return undefined;

        const shift = await ScheduleShiftTemplate.findOne({
            where: { id: taskList.scheduleShiftID },
        });

        if (!shift) return undefined;

        const scheduleTemplateID = shift.scheduleTemplateID;
        const schedule = await ScheduleTemplate.findOne({
            where: { id: scheduleTemplateID },
        });

        return schedule?.businessID;
    } catch (error) {
        Logger.error(`Error fetching ${ScheduleTemplate.name}.`);
        return undefined;
    }
};

class ShiftTaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/shiftTaskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(shiftTaskListIDResolver), (req, res) =>
            ScheduleDatabase.create(ShiftTaskTemplate, req, res),
        );
        router.put("/", businessAuth(shiftTaskListIDResolver), (req, res) =>
            ScheduleDatabase.update(ShiftTaskTemplate, req, res, "id"),
        );
        router.delete("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(ShiftTaskTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(ShiftTaskTemplate, req, res, "id"),
        );
        router.get(
            "/shiftTaskList/:shiftTaskListID",
            businessAuth(shiftTaskListIDResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    ShiftTaskTemplate,
                    req,
                    res,
                    {},
                    "shiftTaskListID",
                ),
        );
    }

    public async createOrUpdateTask(
        task: ShiftTaskTemplate,
        listOrder: number,
    ): Promise<void> {
        let id = task.id;
        task.listOrder = listOrder;

        if (task.id > 0)
            await ShiftTaskTemplate.update(task, { where: { id } });
        else {
            let taskInstance = await ShiftTaskTemplate.create(task);
            id = taskInstance.id;
        }
    }
}

export const shiftTaskTemplateRouter = new ShiftTaskTemplateRouter();
