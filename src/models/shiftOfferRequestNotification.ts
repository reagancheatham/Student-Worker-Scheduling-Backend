import { Model, DataTypes } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router, Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftOfferRequest } from "./shiftOfferRequest.ts";
import { Shift } from "./shift.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";

export class ShiftOfferRequestNotification extends Model<
  InferAttributes<ShiftOfferRequestNotification>,
  InferCreationAttributes<ShiftOfferRequestNotification>
> {
  declare id: CreationOptional<number>;
  declare shiftOfferRequestID: number;
  declare dismissed: CreationOptional<boolean>;
}

ShiftOfferRequestNotification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shiftOfferRequestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ShiftOfferRequests",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    dismissed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["id", "shiftOfferRequestID", "dismissed"],
        name: "shiftOfferRequestNotificationIndex",
      },
    ],
  },
);

class ShiftOfferRequestNotificationRouter extends ModelRouter {
  public path(): string {
    return "/shiftOfferRequestNotifications";
  }

  protected buildRouter(router: Router): void {
    router.post("/", (req, res) =>
      ScheduleDatabase.create(ShiftOfferRequestNotification, req, res),
    );
    router.put("/", (req, res) =>
      ScheduleDatabase.update(ShiftOfferRequestNotification, req, res, "id"),
    );
    router.delete("/:id", (req, res) =>
      ScheduleDatabase.delete(ShiftOfferRequestNotification, req, res, "id"),
    );
    router.get("/:id", (req, res) =>
      ScheduleDatabase.get(ShiftOfferRequestNotification, req, res, "id"),
    );
    router.get("/business/:businessID", (req, res) =>
      ScheduleDatabase.getAllWhere(
        ShiftOfferRequestNotification,
        req,
        res,
        [],
        {
          include: [
            {
              model: ShiftOfferRequest,
              required: true,
              include: [
                {
                  model: Shift,
                  required: true,
                  where: { businessID: req.params.businessID },
                  include: [
                    {
                      model: Employee,
                      required: false,
                      include: [
                        {
                          model: User,
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    );
  }
}

export const shiftOfferRequestNotificationRouter =
  new ShiftOfferRequestNotificationRouter();
