import "dotenv/config";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3306;
const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;

export interface DatabaseConfig {
    DB_NAME: string;
    PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
}

console.log("User: " + DB_USER);
const databaseConfig: DatabaseConfig = {
    DB_NAME,
    PORT,
    DB_USER,
    DB_PASSWORD,
};

export default databaseConfig;
