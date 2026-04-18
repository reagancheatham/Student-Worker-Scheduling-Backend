import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { adminAuth } from "../authentication.ts";

export class PermissionRole extends Model<
    InferAttributes<PermissionRole>,
    InferCreationAttributes<PermissionRole>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

PermissionRole.init(
    {
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
                fields: ["name"],
            },
        ],
    },
);

class PermissionRoleRouter extends ModelRouter {
    public path(): string {
        return "/permissionRoles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(PermissionRole, req, res),
        );
        router.put("/", adminAuth(), (req, res) =>
            ScheduleDatabase.update(PermissionRole, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(PermissionRole, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(PermissionRole, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(PermissionRole, req, res),
        );
    }
}

export const permissionRoleRouter = new PermissionRoleRouter();