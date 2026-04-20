import { Employee } from "../models/employee.ts";
import { Settings } from "../models/settings.ts";
import { User } from "../models/user.ts";
import { EmployeeUnavailabilitySyncService } from "./employeeUnavailabilitySyncService.ts";

export class DailyStudentScheduleRefreshService {
    private static timer: NodeJS.Timeout | null = null;
    private static isRunning = false;

    public static start(): void {
        if (this.timer) {
            return;
        }

        const enabled = this.isEnabled();
        if (!enabled) {
            console.log("Daily student schedule refresh is disabled.");
            return;
        }

        this.scheduleNextMidnightRefresh();
    }

    private static isEnabled(): boolean {
        const configured = String(
            process.env.STUDENT_SCHEDULE_DAILY_REFRESH_ENABLED ?? "true",
        ).trim().toLowerCase();

        return configured !== "false" && configured !== "0";
    }

    private static async runRefresh(): Promise<void> {
        if (this.isRunning) {
            console.log("Daily student schedule refresh already in progress. Skipping.");
            return;
        }

        this.isRunning = true;

        try {
            const employees = await Employee.findAll({
                include: [{ model: User, required: true }],
            });
            const businessTermCodeLookup = new Map<number, string>();
            const fallbackTermCode = String(
                process.env.STUDENT_SCHEDULE_DEFAULT_TERM_CODE ?? "",
            ).trim();

            let employeesProcessed = 0;
            let employeesSkipped = 0;
            let employeesSkippedNoTermCode = 0;
            let blocksPrepared = 0;
            let blocksInserted = 0;
            let blocksUpdated = 0;
            let blocksRemoved = 0;

            for (const employee of employees) {
                const user = (employee as Employee & { User?: User }).User;

                if (!user) {
                    employeesSkipped += 1;
                    continue;
                }

                let businessDefaultTermCode = businessTermCodeLookup.get(employee.businessID);

                if (businessDefaultTermCode === undefined) {
                    const businessSettings = await Settings.findByPk(employee.businessID);
                    businessDefaultTermCode = String(
                        businessSettings?.defaultTermCode ?? "",
                    ).trim();
                    businessTermCodeLookup.set(employee.businessID, businessDefaultTermCode);
                }

                const termCode = businessDefaultTermCode || fallbackTermCode;

                if (!termCode) {
                    employeesSkipped += 1;
                    employeesSkippedNoTermCode += 1;
                    continue;
                }

                const syncResult = await EmployeeUnavailabilitySyncService.syncForEmployee(
                    employee.id,
                    {
                        studentID: user.studentID,
                        email: user.email,
                    },
                    termCode,
                );

                if (!syncResult) {
                    employeesSkipped += 1;
                    continue;
                }

                employeesProcessed += 1;
                blocksPrepared += syncResult.blocksPrepared;
                blocksInserted += syncResult.blocksInserted;
                blocksUpdated += syncResult.blocksUpdated;
                blocksRemoved += syncResult.blocksRemoved;
            }

            console.log("Daily student schedule refresh completed", {
                employeesFound: employees.length,
                employeesProcessed,
                employeesSkipped,
                employeesSkippedNoTermCode,
                blocksPrepared,
                blocksInserted,
                blocksUpdated,
                blocksRemoved,
            });
        } catch (error) {
            console.error(`Error during daily student schedule refresh: ${error}`);
        } finally {
            this.isRunning = false;
            this.scheduleNextMidnightRefresh();
        }
    }

    private static scheduleNextMidnightRefresh(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);

        const delayMs = Math.max(1, nextMidnight.getTime() - now.getTime());

        this.timer = setTimeout(() => {
            this.runRefresh().catch((error) => {
                console.error(`Daily student schedule refresh failed: ${error}`);
            });
        }, delayMs);

        console.log(
            `Daily student schedule refresh scheduled for ${nextMidnight.toISOString()}`,
        );
    }
}