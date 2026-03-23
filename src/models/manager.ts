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
import { Employee } from "./employee.ts";

export class Manager extends Model<
  InferAttributes<Manager>,
  InferCreationAttributes<Manager>
> {
  declare id: CreationOptional<number>;
  declare isOwner: boolean;
  declare businessID: number;
  declare employeeID: number;
}

Manager.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    businessID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    timestamps: false,
  },
);

class ManagerRouter extends ModelRouter {
  public path(): string {
    return "/managers";
  }

  protected buildRouter(router: Router): void {
    router.post("/", (req, res) => ScheduleDatabase.create(Manager, req, res));
    router.put("/", (req, res) =>
      ScheduleDatabase.update(Manager, req, res, "businessID", "employeeID"),
    );
    router.delete("/:businessID/:userID", (req, res) =>
      ScheduleDatabase.delete(Manager, req, res, "businessID", "employeeID"),
    );
    router.get("/:businessID/:userID", (req, res) =>
      ScheduleDatabase.get(Manager, req, res, "businessID", "employeeID"),
    );
    router.get("/:businessID", (req, res) =>
      ScheduleDatabase.getAllWhere(Manager, req, res, "businessID"),
    );
    router.get("/", (req, res) => ScheduleDatabase.getAll(Manager, req, res));
  }
}

export const managerRouter = new ManagerRouter();
