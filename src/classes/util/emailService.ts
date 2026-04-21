import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./logger.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class EmailService {
    private static loadTemplate(templateName: string): string {
        const templatePath = path.resolve(
            __dirname,
            `../../templates/${templateName}`,
        );
        return fs.readFileSync(templatePath, "utf-8");
    }

    public static buildInviteEmail(
        businessName: string,
        inviteLink: string,
    ): string {
        let html = EmailService.loadTemplate("inviteEmail.html");

        html = html
            .replaceAll("{{Product}}", businessName)
            .replaceAll("{{ product }}", businessName)
            .replaceAll("{{ inviteLink }}", inviteLink);

        Logger.log("Built invite email HTML");

        return html;
    }
}
