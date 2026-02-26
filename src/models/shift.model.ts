import { Model, DataTypes, Op } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Shift extends Model<
    InferAttributes<Shift>,
    InferCreationAttributes<Shift>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare employeeID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
}

Shift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startTime", "endTime", "businessID", "employeeID"],
            },
        ],
    },
);

type ShiftRangeParams = {
    businessID: string;
    startTime: string;
    endTime: string;
};

class ShiftRouter extends ModelRouter {
    public path(): string {
        return "/shifts";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Shift, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Shift, req, res, "businessID", "id"),
        );
        router.delete("/:businessID/:id", (req, res) =>
            ScheduleDatabase.delete(Shift, req, res, "businessID", "id"),
        );
        router.get("/:businessID/:id", (req, res) =>
            ScheduleDatabase.get(Shift, req, res, "businessID", "id"),
        );
        router.get("/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(Shift, req, res, "businessID"),
        );
        router.get(
            "/:businessID/startTime>=:startTime/endTime<=:endTime",
            (req, res) => this.getShiftsWithinRange(req, res),
        );
    }

    private async getShiftsWithinRange(
        req: Request<ShiftRangeParams>,
        res: Response,
    ) {
        const businessID = Number(req.params.businessID);
        const startTime = new Date(req.params.startTime);
        const endTime = new Date(req.params.endTime);

        const where = {
            businessID,
            startTime: {
                [Op.gte]: startTime,
            },
            endTime: {
                [Op.lte]: endTime,
            },
        };

        await Shift.findAll({
            where,
        })
            .then((result) => {
                console.log(`Found ${result.length} ${Shift.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting all ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }
}

export const shiftRouter = new ShiftRouter();