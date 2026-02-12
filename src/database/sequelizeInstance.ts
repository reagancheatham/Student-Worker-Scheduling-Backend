import { Sequelize } from "sequelize";
import databaseConfig from "./databaseConfig.ts";


export const sequelizeInstance = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: databaseConfig.PORT,
    username: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE_NAME,
});

export default sequelizeInstance;
