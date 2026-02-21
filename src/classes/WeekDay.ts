export const WeekDay = {
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
} as const

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];