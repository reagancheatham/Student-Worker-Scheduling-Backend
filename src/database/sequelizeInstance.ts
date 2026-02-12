import { Sequelize } from "sequelize";
import databaseConfig from "./databaseConfig.ts";

export const sequelizeInstance = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    port: databaseConfig.PORT.valueOf(),
    username: databaseConfig.DB_USER.valueOf(),
    password: databaseConfig.DB_PASSWORD.valueOf(),
    database: databaseConfig.DB_NAME.valueOf(),
});

export default sequelizeInstance;
