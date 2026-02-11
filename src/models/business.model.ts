import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import sequelizeInstance from "../database/sequelizeInstance";

class Business extends Model<InferAttributes<Business>, InferCreationAttributes<Business>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare address: string;
    declare city: string;
    declare state: string;
}

Business.init ( {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    sequelize: sequelizeInstance,
    tableName: "businesses",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["name", "address", "city", "state"],
      },
    ],
  })

  export default Business;