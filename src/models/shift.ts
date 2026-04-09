import { Model, DataTypes, Op } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Business } from "./business.ts";
import { EventColor } from "../classes/eventColor.ts";
import { User } from "./user.ts";
import { adminAuth, businessAuth } from "../authentication.ts";
import { Logger } from "../classes/util/logger.ts";

export class Shift extends Model<
    InferAttributes<Shift>,
    InferCreationAttributes<Shift>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare employeeID: CreationOptional<number>;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare color: EventColor;
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
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "SET NULL",
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
        color: {
            type: DataTypes.ENUM(...Object.values(EventColor)),
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                fields: ["name", "startTime", "endTime", "businessID", "color"],
            },
        ],
    },
);

type ShiftParams = {
    businessID: string;
    id: string;
};

type ShiftRangeParams = {
    businessID: string;
    startTime: string;
    endTime: string;
};

type ShiftRangeParamsEmployee = {
    employeeID: string;
    startTime: string;
    endTime: string;
};

class ShiftRouter extends ModelRouter {
    public path(): string {
        return "/shifts";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth, (req, res) =>
            ScheduleDatabase.create(Shift, req, res),
        );
        router.put("/", businessAuth, (req, res) =>
            ScheduleDatabase.update(Shift, req, res, "id"),
        );
        router.delete("/:id", businessAuth, (req, res) =>
            ScheduleDatabase.delete(Shift, req, res, "id"),
        );
        router.get(
            "/business/:businessID/startTime=:startTime/endTime=:endTime",
            businessAuth,
            (req: any, res) => this.getShiftsForBusinessWithinRange(req, res),
        );
        router.get(
            "/employee/:employeeID/startTime=:startTime/endTime=:endTime",
            businessAuth,
            (req: any, res) => this.getShiftsForEmployeeWithinRange(req, res),
        );
        router.get("/:id", businessAuth, this.getShift);
        router.get(
            "/business/:businessID",
            businessAuth,
            this.getShiftsForBusiness,
        );
    }

    private async getShift(req: Request<ShiftParams>, res: Response) {
        const id = Number(req.params.id);

        const where: any = {
            id,
        };

        Logger.log(
            `Getting ${Shift.name} with info: ${JSON.stringify(where)}`,
        );

        await Shift.findOne({
            where,
            include: [
                {
                    model: Employee,
                    include: [User],
                },
            ],
        })
            .then((result) => {
                Logger.log(`Found ${Shift.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error getting ${Shift.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    private async getShiftsForBusiness(
        req: Request<{ businessID: string }>,
        res: Response,
    ) {
        const businessID = Number(req.params.businessID);

        const where: any = {
            businessID,
        };

        Logger.log(
            `Getting ${Shift.name}s with info: ${JSON.stringify(where)}`,
        );

        await Shift.findAll({
            where,
            include: {
                model: Employee,
                include: [User],
            },
        })
            .then((results) => {
                Logger.log(`Found ${results.length} ${Shift.name}s`);
                res.status(200).send(results);
            })
            .catch((error) => {
                Logger.error(`Error getting ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }

    private async getShiftsForBusinessWithinRange(
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
            include: {
                model: Employee,
                include: [User],
            },
        })
            .then((result) => {
                Logger.log(`Found ${result.length} ${Shift.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error getting all ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }

    private async getShiftsForEmployeeWithinRange(
        req: Request<ShiftRangeParamsEmployee>,
        res: Response,
    ) {
        const employeeID = Number(req.params.employeeID);
        const startTime = new Date(req.params.startTime);
        const endTime = new Date(req.params.endTime);

        const where = {
            employeeID,
            startTime: {
                [Op.gte]: startTime,
            },
            endTime: {
                [Op.lte]: endTime,
            },
        };

        await Shift.findAll({
            where,
            include: {
                model: Employee,
                include: [User],
            },
        })
            .then((result) => {
                Logger.log(`Found ${result.length} ${Shift.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error getting all ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }
}

export const shiftRouter = new ShiftRouter();
