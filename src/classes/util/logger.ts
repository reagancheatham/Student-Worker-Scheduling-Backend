const logPrefixColor = "\x1b[32m";
const logColor = "\x1b[0m";
const errorColor = "\x1b[31m%s\x1b[0m";
const logPrefix = `${logPrefixColor}[INFO]${logColor}`;
const errorPrefix = `${errorColor}[ERROR]`;

export class Logger {
    public static log(...data: any[]): void {
        console.log(logPrefix, ...data);
    }

    public static error(...data: any[]): void {
        console.error(errorPrefix, ...data);
    }
}
