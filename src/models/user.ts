import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { PermissionRole } from "./permissionRole.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare studentID: number;
    declare permissionRoleID: number;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phoneNumber: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PermissionRole,
                key: "id",
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
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
                fields: [
                    "studentID",
                    "permissionRoleID",
                    "firstName",
                    "lastName",
                ],
            },
        ],
    },
);

class UserRouter extends ModelRouter {
    public path(): string {
        return "/users";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) => ScheduleDatabase.create(User, req, res));
        router.put("/", (req, res) =>
            ScheduleDatabase.update(User, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(User, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(User, req, res, "id"),
        );
        router.get("/", (req, res) => ScheduleDatabase.getAll(User, req, res));
    }
}

export const userRouter = new UserRouter();
