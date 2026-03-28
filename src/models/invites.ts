import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { CodeService } from "../classes/randomeCode.ts";

export class Invite extends Model<
    InferAttributes<Invite>,
    InferCreationAttributes<Invite>
> {
    declare code: string;
    declare email: string;
    declare businessID: number;
    declare businessPermissionRoleID: number;

    public static async createInvite(
        email: string,
        businessID: number,
        businessPermissionRoleID: number,
        transaction: Transaction,
    ) {
        const code = CodeService.generate10DigitCode();

        console.log("Creating invite");
        await Invite.create(
            {
                code,
                email: email,
                businessID: businessID,
                businessPermissionRoleID: businessPermissionRoleID,
            },
            { transaction: transaction },
        )
            .then((result) => {
                console.log("Successfully created invite");
                return result;
            })
            .catch((error) => {
                console.log(`Error creating invite: ${error}`);
                return null;
            });
    }
}

Invite.init(
    {
        code: {
            primaryKey: true,
            type: DataTypes.STRING(10),
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
                model: "Businesses",
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
            ScheduleDatabase.update(Invite, req, res, "code"),
        );
        router.delete("/:code", (req, res) =>
            ScheduleDatabase.delete(Invite, req, res, "code"),
        );
        router.get("/:code", (req, res) =>
            ScheduleDatabase.get(Invite, req, res, "code"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Invite, req, res),
        );
    }
}

export const inviteRouter = new InviteRouter();
