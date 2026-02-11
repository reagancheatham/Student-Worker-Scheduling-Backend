export const DaysOfWeek = {
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
} as const;

export type DaysOfWeek =
  typeof DaysOfWeek[keyof typeof DaysOfWeek];