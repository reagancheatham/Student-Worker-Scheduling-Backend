export const TaskStatus = {
    Complete: "COMPLETE",
    Incomplete: "INCOMPLETE",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
