import { EmployeeUnavailability } from "../models/employeeUnavailability.ts";

const dayCodeToWeekday: Record<string, number> = {
    SU: 0,
    SUN: 0,
    M: 1,
    MON: 1,
    T: 2,
    TU: 2,
    TUE: 2,
    W: 3,
    WED: 3,
    TH: 4,
    THU: 4,
    R: 4,
    F: 5,
    FRI: 5,
    SA: 6,
    SAT: 6,
};

type StudentMeetingTime = {
    days?: string[];
    start_time?: string;
    end_time?: string;
};

type StudentCourse = {
    CourseName?: string;
    CourseID?: string;
    start_date?: string;
    end_date?: string;
    meeting_times?: StudentMeetingTime[];
};

type StudentScheduleResponse = {
    Success?: string | boolean;
    Message?: string;
    Courses?: StudentCourse[];
};

type UnavailabilityPayload = Pick<
    EmployeeUnavailability,
    "employeeID" | "name" | "startTime" | "endTime"
>;

export class StudentScheduleService {
    public static async loadEmployeeUnavailabilityFromSchedule(
        employeeID: number,
        userID: string,
        termCode: string,
    ): Promise<UnavailabilityPayload[]> {
        const apiBaseUrl = process.env.STUDENT_SCHEDULE_API_BASE_URL;

        if (!apiBaseUrl) {
            throw new Error(
                "STUDENT_SCHEDULE_API_BASE_URL is missing from environment",
            );
        }

        const url = `${apiBaseUrl.replace(/\/$/, "")}/${encodeURIComponent(userID)}/${encodeURIComponent(termCode)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Student schedule API error (${response.status}) for user ${userID}`,
            );
        }

        const payload = (await response.json()) as StudentScheduleResponse;

        if (!this.isSuccess(payload.Success)) {
            throw new Error(
                payload.Message ??
                    "Student schedule API returned an unsuccessful response",
            );
        }

        const courses = payload.Courses ?? [];
        const blocks: UnavailabilityPayload[] = [];

        for (const course of courses) {
            const meetingTimes = course.meeting_times ?? [];
            const courseStart = this.parseDate(course.start_date);
            const courseEnd = this.parseDate(course.end_date);

            if (!courseStart || !courseEnd) continue;

            for (const meetingTime of meetingTimes) {
                if (!meetingTime.days || !meetingTime.start_time || !meetingTime.end_time) {
                    continue;
                }

                const startMinutes = this.parse12HourClock(meetingTime.start_time);
                const endMinutes = this.parse12HourClock(meetingTime.end_time);

                if (startMinutes === null || endMinutes === null) continue;

                const days = meetingTime.days
                    .map((day) => dayCodeToWeekday[day.toUpperCase()])
                    .filter((weekday): weekday is number => weekday !== undefined);

                if (days.length === 0) continue;

                for (const occurrenceDate of this.eachMatchingDay(
                    courseStart,
                    courseEnd,
                    new Set(days),
                )) {
                    const startDateTime = this.combineDateAndMinutes(
                        occurrenceDate,
                        startMinutes,
                    );
                    const endDateTime = this.combineDateAndMinutes(
                        occurrenceDate,
                        endMinutes,
                    );

                    if (endDateTime <= startDateTime) continue;

                    blocks.push({
                        employeeID,
                        name: course.CourseID || course.CourseName || "Class",
                        startTime: startDateTime,
                        endTime: endDateTime,
                    });
                }
            }
        }

        return this.dedupeBlocks(blocks);
    }

    private static isSuccess(success: StudentScheduleResponse["Success"]): boolean {
        if (typeof success === "boolean") return success;
        if (typeof success === "string") return success.toLowerCase() === "true";

        return false;
    }

    private static parseDate(value?: string): Date | null {
        if (!value) return null;

        const dateParts = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!dateParts) return null;

        const month = Number.parseInt(dateParts[1], 10) - 1;
        const day = Number.parseInt(dateParts[2], 10);
        const year = Number.parseInt(dateParts[3], 10);

        return new Date(year, month, day);
    }

    private static parse12HourClock(value: string): number | null {
        const timeParts = value.trim().match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
        if (!timeParts) return null;

        let hour = Number.parseInt(timeParts[1], 10);
        const minute = Number.parseInt(timeParts[2], 10);
        const meridiem = timeParts[3].toUpperCase();

        if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

        if (hour === 12) hour = 0;
        if (meridiem === "PM") hour += 12;

        return hour * 60 + minute;
    }

    private static combineDateAndMinutes(date: Date, minutesFromMidnight: number): Date {
        const hours = Math.floor(minutesFromMidnight / 60);
        const minutes = minutesFromMidnight % 60;

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes,
            0,
            0,
        );
    }

    private static *eachMatchingDay(
        startDate: Date,
        endDate: Date,
        matchingDays: Set<number>,
    ): Generator<Date> {
        const current = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
        );
        const end = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
        );

        while (current <= end) {
            if (matchingDays.has(current.getDay())) {
                yield new Date(current);
            }

            current.setDate(current.getDate() + 1);
        }
    }

    private static dedupeBlocks(
        blocks: UnavailabilityPayload[],
    ): UnavailabilityPayload[] {
        const unique = new Map<string, UnavailabilityPayload>();

        for (const block of blocks) {
            const key = `${block.employeeID}|${block.startTime.toISOString()}|${block.endTime.toISOString()}`;
            if (!unique.has(key)) unique.set(key, block);
        }

        return [...unique.values()];
    }
}
