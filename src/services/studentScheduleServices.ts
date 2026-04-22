import { Logger } from "../classes/util/logger.ts";
import { WeekDay } from "../classes/weekDay.ts";
import { Employee } from "../models/employee.ts";
import { User } from "../models/user.ts";
import { UserClass } from "../models/userClass.ts";
import fetch from "node-fetch";

const dayCodeToWeekday: Record<string, WeekDay> = {
    SU: WeekDay.Sunday,
    SUN: WeekDay.Sunday,
    M: WeekDay.Monday,
    MON: WeekDay.Monday,
    T: WeekDay.Tuesday,
    TU: WeekDay.Tuesday,
    TUE: WeekDay.Tuesday,
    W: WeekDay.Wednesday,
    WED: WeekDay.Wednesday,
    TH: WeekDay.Thursday,
    THU: WeekDay.Thursday,
    R: WeekDay.Thursday,
    F: WeekDay.Friday,
    FRI: WeekDay.Friday,
    SA: WeekDay.Saturday,
    SAT: WeekDay.Saturday,
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
    Success?: boolean;
    Message?: string;
    Courses?: StudentCourse[];
};

export class StudentScheduleServices {
    public static async importClassesForAllUsers(term: string) {
        const users = await User.findAll();

        await this.importClassesForUsers(users, term);
    }

    public static async importClassesForBusiness(
        businessID: number,
        term: string,
    ) {
        const users = await User.findAll({
            include: {
                model: Employee,
                required: true,
                where: {
                    businessID,
                },
                attributes: [],
            },
        });

        await this.importClassesForUsers(users, term);
    }

    private static async importClassesForUsers(users: User[], term: string) {
        try {
            let usersProcessed = 0;
            const userErrors: Array<{
                userID: number;
                message: string;
            }> = [];

            const promises: Promise<void>[] = users.map(async (user) => {
                try {
                    await StudentScheduleServices.importClassesForUser(
                        user,
                        term,
                    );

                    usersProcessed++;
                } catch (error: any) {
                    Logger.error(`Error importing schedule: ${error}`);

                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to import student schedule";

                    userErrors.push({
                        userID: user.id,
                        message,
                    });
                }
            });

            await Promise.all(promises);

            Logger.log("Imported student schedules:", {
                usersFound: users.length,
                usersProcessed,
            });
        } catch (error: any) {
            throw error;
        }
    }

    public static async importClassesForUser(user: User, term: string) {
        const studentAPIURL = process.env.STUDENT_SCHEDULE_URL;

        if (!studentAPIURL)
            throw new Error("STUDENT_SCHEDULE_URL is missing from environment");

        const url = `${studentAPIURL}/${user.studentID}/${term}`;
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(
                `Student Schedule API error (${response.status}) for user ${user.studentID}`,
            );

        const payload = (await response.json()) as StudentScheduleResponse;

        if (!payload.Success)
            throw new Error(
                payload.Message ??
                    "Student Schedule API returned an unsuccessful response",
            );

        const databaseCourses = await UserClass.findAll({
            where: { userID: user.id },
        });
        const apiCourses = payload.Courses ?? [];
        const deletePromises: Promise<any>[] = [];

        for (const course of databaseCourses) {
            if (!apiCourses.find((c) => c.CourseID === course.courseID))
                deletePromises.push(
                    UserClass.destroy({ where: { courseID: course.courseID } }),
                );
        }

        await Promise.all(deletePromises);

        for (const course of apiCourses) {
            const meetingTimes = course.meeting_times ?? [];
            const name = course.CourseName;
            const courseID = course.CourseID;
            const startDate = StudentScheduleServices.parseDate(
                course.start_date,
            );
            const endDate = StudentScheduleServices.parseDate(course.end_date);

            if (!startDate || !endDate || !name || !courseID) continue;

            for (const meetingTime of meetingTimes) {
                if (
                    !meetingTime.days ||
                    !meetingTime.start_time ||
                    !meetingTime.end_time
                )
                    continue;

                const weekDays = meetingTime.days
                    .map((day) => dayCodeToWeekday[day.toUpperCase()])
                    .filter((weekday) => weekday !== undefined);

                if (weekDays.length === 0) continue;

                const startTime = StudentScheduleServices.parse12HourClock(
                    meetingTime.start_time,
                );
                const endTime = StudentScheduleServices.parse12HourClock(
                    meetingTime.end_time,
                );

                if (!startTime || !endTime)
                    throw Error(`Student Schedule API returned invalid times`);

                const updateBody = {
                    userID: user.id,
                    courseID,
                    name,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    term,
                    weekDays,
                };

                const [_, created] = await UserClass.findOrCreate({
                    where: { userID: user.id, courseID },
                    defaults: updateBody,
                });

                if (!created)
                    await UserClass.update(updateBody, {
                        where: { userID: user.id, courseID },
                    });
            }
        }
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

    private static parse12HourClock(value: string): string | null {
        const timeParts = value.trim().match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
        if (!timeParts) return null;

        let hour = Number.parseInt(timeParts[1], 10);
        const minute = Number.parseInt(timeParts[2], 10);
        const meridiem = timeParts[3].toUpperCase();

        if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

        if (hour === 12) hour = 0;
        if (meridiem === "PM") hour += 12;

        const hourString = hour > 9 ? hour.toString() : `0${hour}`;
        const minuteString = minute > 9 ? minute.toString() : `0${minute}`;

        return `${hourString}:${minuteString}`;
    }
}
