import "dotenv/config";

const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;

export interface DatabaseConfig {
    DB_NAME: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
}

export const databaseConfig: DatabaseConfig = {
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
};
