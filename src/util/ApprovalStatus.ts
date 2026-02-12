export const ApprovalStatus = {
    Pending: "Pending",
    Approved: "Approved",
    Denied: "Denied",
} as const

export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];