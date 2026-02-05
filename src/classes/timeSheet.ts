export default class TimeSheet {
    public id: number = -1;
    public startTime: Date;
    public endTime: Date;
    public status: Status;
    public shiftID: number;

    constructor(
        id: number,
        startTime: Date,
        endTime: Date,
        status: Status,
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
        this.status = Status.Pending;
        this.shiftID = shiftID;
    }
}

enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Denied = "Denied",
}
