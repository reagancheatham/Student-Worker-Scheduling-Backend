import { Sequelize } from "sequelize";
import databaseConfig from "./databaseConfig.ts";


export const sequelizeInstance = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: databaseConfig.PORT.valueOf(),
    username: databaseConfig.USER.valueOf(),
    password: databaseConfig.PASSWORD.valueOf(),
    database: databaseConfig.DATABASE_NAME.valueOf(),
});

export default sequelizeInstance;
