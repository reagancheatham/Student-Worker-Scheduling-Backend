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

export class BusinessPermissionRole extends Model<
    InferAttributes<BusinessPermissionRole>,
    InferCreationAttributes<BusinessPermissionRole>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

BusinessPermissionRole.init(
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
    },
);

class BusinessPermissionRoleRouter extends ModelRouter {
    public path(): string {
        return "/businessPermissionRoles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(BusinessPermissionRole, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(BusinessPermissionRole, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(BusinessPermissionRole, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(BusinessPermissionRole, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(BusinessPermissionRole, req, res),
        );
    }
}

export const businessPermissionRoleRouter = new BusinessPermissionRoleRouter();
