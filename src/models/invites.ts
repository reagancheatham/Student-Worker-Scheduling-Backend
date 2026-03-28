import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";

export class Invite extends Model<
    InferAttributes<Invite>,
    InferCreationAttributes<Invite>
> {
    declare code: number;
    declare email: string;
    declare businessID: number;
    declare businessPermissionRoleID: number;
}

Invite.init(
    {
        code: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
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
        businessPermissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: BusinessPermissionRole,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["code", "email"],
                name: "inviteIndex",
            },
        ],
    },
);

class InviteRouter extends ModelRouter {
    public path(): string {
        return "/invites";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Invite, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Invite, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Invite, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Invite, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Invite, req, res),
        );
    }

}

export const inviteRouter = new InviteRouter();
