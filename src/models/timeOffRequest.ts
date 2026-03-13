import { Model, DataTypes } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ApprovalStatus } from "../classes/ApprovalStatus.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Request, Response } from "express";
import { User } from "./user.ts";

export class TimeOffRequest extends Model<
  InferAttributes<TimeOffRequest>,
  InferCreationAttributes<TimeOffRequest>
> {
  declare id: CreationOptional<number>;
  declare employeeID: number;
  declare reason: string;
  declare startDate: Date;
  declare endDate: Date;
  declare status: ApprovalStatus;
}

TimeOffRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["employeeID", "reason", "startDate", "endDate", "status"],
        name: "timeOffRequestIndex",
      },
    ],
  },
);

class TimeOffRequestRouter extends ModelRouter {
  public path(): string {
    return "/timeOffRequests";
  }

  protected buildRouter(router: Router): void {
    router.post("/", (req, res) =>
      ScheduleDatabase.create(TimeOffRequest, req, res),
    );
    router.put("/", (req, res) =>
      ScheduleDatabase.update(TimeOffRequest, req, res, "id"),
    );
    router.delete("/:id", (req, res) =>
      ScheduleDatabase.delete(TimeOffRequest, req, res, "id"),
    );
    router.get("/:id", (req, res) =>
      ScheduleDatabase.get(TimeOffRequest, req, res, "id"),
    );
    router.get("/employee/:employeeID", (req, res) =>
      ScheduleDatabase.getAllWhere(TimeOffRequest, req, res, "employeeID"),
    );
    router.get("/business/:businessID", this.getTimeOffRequestForBusiness);
  }

  private async getTimeOffRequestForBusiness(req: Request, res: Response) {
    const businessID = req.params["businessID"];

    console.log(`Getting ${Employee.name}s with businessID: ${businessID}`);

    await TimeOffRequest.findAll({
      include: [
        {
          model: Employee,
          required: true,
          where: { businessID },
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    })
      .then((result) => {
        console.log(`Found ${Employee.name}: ${JSON.stringify(result)}`);
        res.status(200).send(result);
      })
      .catch((error) => {
        console.error(`Error finding ${Employee.name}: ${error}`);
        res.status(500).send({ error });
      });
  }
}

export const timeOffRequestRouter = new TimeOffRequestRouter();
