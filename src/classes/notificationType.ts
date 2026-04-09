export const NotificationType = {
    Alert: "Alert",
    Message: "Message",
    Warning: "Warning",
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];