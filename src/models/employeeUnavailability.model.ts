import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import Employee from "./employee.model";

class EmployeeUnavailability extends Model<
    InferAttributes<EmployeeUnavailability>,
    InferCreationAttributes<EmployeeUnavailability>
> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date;
    declare employeeID: number
}

EmployeeUnavailability.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    employeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: "id",
        },
        onDelete: "CASCADE",
    },
},
{
    sequelize: sequelizeInstance,
    tableName: "employeeUnavailability",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["startTime", "endTime", "employeeID"],
      },
    ],
  })

export default EmployeeUnavailability;
