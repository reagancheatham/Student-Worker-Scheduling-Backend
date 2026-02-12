import { ApprovalStatus } from "../util/ApprovalStatus.ts";

export default class TimeSheet {
    public id: number = -1;
    public startTime: Date;
    public endTime: Date;
    public status: ApprovalStatus;
    public shiftID: number;

    constructor(
        id: number,
        startTime: Date,
        endTime: Date,
        status: ApprovalStatus,
        shiftID: number,
    ) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.shiftID = shiftID;
    }

    createData(startTime: Date, shiftID: number) {
        this.id = -2;
        this.startTime = startTime;
        this.endTime = new Date(2000, 1, 1, 1, 1, 1);
        this.status = ApprovalStatus.Pending;
        this.shiftID = shiftID;
    }
}

