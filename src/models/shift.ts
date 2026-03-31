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

class ShiftRouter extends ModelRouter {
    public path(): string {
        return "/shifts";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Shift, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Shift, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Shift, req, res, "id"),
        );
        router.get("/:id", this.getShift);
        router.get("/business/:businessID", this.getShiftsForBusiness);
        router.get(
            "/business/:businessID/startTime=:startTime/endTime=:endTime",
            (req, res) => this.getShiftsWithinRange(req, res),
        );
    }

    private async getShift(req: Request<ShiftParams>, res: Response) {
        const id = Number(req.params.id);

        const where: any = {
            id,
        };

        console.log(
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
                console.log(`Found ${Shift.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.error(`Error getting ${Shift.name}: ${error}`);
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

        console.log(
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
                console.log(`Found ${results.length} ${Shift.name}s`);
                res.status(200).send(results);
            })
            .catch((error) => {
                console.error(`Error getting ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
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
            include: {
                model: Employee,
                include: [User],
            },
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
