import "dotenv/config";

const DB_HOST = process.env.DB_HOST as string;
const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PW = process.env.DB_PW as string;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

export interface DatabaseConfig {
    DB_HOST: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PW: string;
    DB_PORT: number;
}

export const databaseConfig: DatabaseConfig = {
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PW,
    DB_PORT,
};
