const logPrefixColor = "\x1b[32m";
const logColor = "\x1b[0m";
const errorColor = "\x1b[31m";
const sequelizeColor = "\x1b[90m";
const logPrefix = `${logPrefixColor}[INFO]${logColor}`;
const errorPrefix = `${errorColor}[ERROR]`;
const sequelizePrefix = `${sequelizeColor}[SEQUELIZE]`;

export class Logger {
    public static log(...data: any[]): void {
        console.log(logPrefix, ...data);
    }

    public static error(...data: any[]): void {
        console.error(errorPrefix, ...data);
    }

    public static sequelize(msg: string): void {
        console.log(sequelizePrefix, msg);
    }
}
