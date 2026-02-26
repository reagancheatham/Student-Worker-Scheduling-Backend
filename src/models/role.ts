import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
> {
    declare businessID: number;
    declare id: CreationOptional<number>;
    declare name: string;
}

Role.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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

class RoleRouter extends ModelRouter {
    public path(): string {
        return "/roles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) => ScheduleDatabase.create(Role, req, res));
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Role, req, res, "businessID", "id"),
        );
        router.delete("/:businessID/:id", (req, res) =>
            ScheduleDatabase.delete(Role, req, res, "businessID", "id"),
        );
        router.get("/:businessID/:id", (req, res) =>
            ScheduleDatabase.get(Role, req, res, "businessID", "id"),
        );
        router.get("/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(Role, req, res, "businessID"),
        );
    }
}

export const roleRouter = new RoleRouter();
