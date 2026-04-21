import { Logger } from "../classes/util/logger.ts";
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
            Logger.log("Daily student schedule refresh is disabled.");
            return;
        }

        this.scheduleNextMidnightRefresh();
    }

    private static isEnabled(): boolean {
        return true;
    }

    private static async runRefresh(): Promise<void> {
        if (this.isRunning) {
            Logger.log(
                "Daily student schedule refresh already in progress. Skipping.",
            );
            return;
        }

        this.isRunning = true;

        try {
            const employees = await Employee.findAll({
                include: [{ model: User, required: true }],
            });
            const businessTermCodeLookup = new Map<
                number,
                string | undefined
            >();

            let employeesProcessed = 0;
            let employeesSkipped = 0;

            for (const employee of employees) {
                const user = (employee as Employee & { User?: User }).User;

                if (!user) {
                    employeesSkipped += 1;
                    continue;
                }

                let businessDefaultTermCode = businessTermCodeLookup.get(
                    employee.businessID,
                );

                if (businessDefaultTermCode === undefined) {
                    const businessSettings = await Settings.findByPk(
                        employee.businessID,
                    );
                    businessDefaultTermCode = businessSettings?.defaultTermCode;

                    businessTermCodeLookup.set(
                        employee.businessID,
                        businessDefaultTermCode,
                    );
                }

                const termCode = businessDefaultTermCode;

                if (!termCode) {
                    employeesSkipped += 1;
                    continue;
                }

                const syncResult =
                    await EmployeeUnavailabilitySyncService.syncForEmployee(
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
            }

            Logger.log("Daily student schedule refresh completed", {
                employeesFound: employees.length,
                employeesProcessed,
                employeesSkipped,
            });
        } catch (error) {
            Logger.error(
                `Error during daily student schedule refresh: ${error}`,
            );
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
                Logger.error(`Daily student schedule refresh failed: ${error}`);
            });
        }, delayMs);

        Logger.log(
            `Daily student schedule refresh scheduled for ${nextMidnight.toISOString()}`,
        );
    }
}
