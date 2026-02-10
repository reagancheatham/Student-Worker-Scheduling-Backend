import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, FloatDataType } from 'sequelize';
import sequelizeInstance from "../database/sequelizeInstance.js";

class Employees extends Model<InferAttributes<Employees>, InferCreationAttributes<Employees>> {
    declare id: CreationOptional<number>;
    declare userID: CreationOptional<number>;
    declare buisinessID: number;
    declare studentID: number;
    declare hourlyPayRate: number;
    declare roleID: number;
    declare permissionRoleID: number;
}

Employees.init ( {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    buisinessID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hourlyPayRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    roleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permissionRoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },



},
{
    sequelize: sequelizeInstance,
    tableName: "employees",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["id", "userID", "buisinessID", "studentID", "hourlyPayRate", "roleID", "permissionRoleID"],
      },
    ],
  })