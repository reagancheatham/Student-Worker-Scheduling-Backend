import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import Business from "./business.model";

class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
    declare businessID: number;
}

Setting.init(
    {
        businessID: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "setting",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID"],
            },
        ],
    },
);

export default Setting;
