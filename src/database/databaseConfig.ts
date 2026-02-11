import 'dotenv/config';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3306;
const DATABASE_NAME = process.env.DATABASE_NAME as string;
const USER = process.env.USER as string;
const PASSWORD = process.env.PASSWORD as string;


export interface DatabaseConfig {
  DATABASE_NAME: string;
  PORT: number;
  USER: string;
  PASSWORD: string;
}


const databaseConfig: DatabaseConfig = {
  DATABASE_NAME,
  PORT,
  USER,
  PASSWORD,
};

export default databaseConfig;