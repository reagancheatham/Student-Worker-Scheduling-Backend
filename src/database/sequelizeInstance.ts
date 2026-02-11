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


async function testConnection() {
  try {
    await sequelizeInstance.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

// Call the function
testConnection();