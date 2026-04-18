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

export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare name: string;
}

Role.init(
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
                fields: ["businessID", "name"],
            },
        ],
    },
);

const resolver: BusinessResolver = async (req: Request) => {
    const id = req.params.id;

    if (!id) return undefined;

    const role = await Role.findOne({ where: { id } });

    if (!role) return undefined;
    else return role.businessID;
};

class RoleRouter extends ModelRouter {
    public path(): string {
        return "/roles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(), (req, res) =>
            ScheduleDatabase.create(Role, req, res),
        );
        router.put("/", businessAuth(), (req, res) =>
            ScheduleDatabase.update(Role, req, res, "id"),
        );
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(Role, req, res, "id"),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.get(Role, req, res, "id"),
        );
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(Role, req, res, {}, "businessID"),
        );
    }
}

export const roleRouter = new RoleRouter();
