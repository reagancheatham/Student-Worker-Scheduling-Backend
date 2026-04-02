import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { User } from "./user.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Session extends Model<
    InferAttributes<Session>,
    InferCreationAttributes<Session>
> {
    declare id: CreationOptional<number>;
    declare userID: number;
    declare expirationTime: Date;
    declare token: string;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        expirationTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class SessionRouter extends ModelRouter {
    public path(): string {
        return "/sessions";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Session, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Session, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Session, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Session, req, res, "id"),
        );
        router.get("/user/:userID", (req, res) =>
            ScheduleDatabase.getAllWhere(Session, req, res, ["userID"]),
        );
    }
}

export const sessionRouter = new SessionRouter();