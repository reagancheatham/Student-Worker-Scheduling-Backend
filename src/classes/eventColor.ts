export const EventColor = {
    Blue: "Blue",
    Orange: "Orange",
    Red: "Red",
    Yellow: "Yellow",
    Purple: "Purple",
} as const;

export type EventColor = (typeof EventColor)[keyof typeof EventColor];
