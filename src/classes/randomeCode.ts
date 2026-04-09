import { randomInt } from "crypto";

export class CodeService {
    public static generate10DigitCode(): string {
        let code = "";

        for (let i = 0; i < 10; i++) {
            code += randomInt(0, 10);
        }

        return code;
    }
}