export default class TimeOffRequest {
    public id: number = -1; //PK
    public startDate: Date;
    public endDate: Date;
    public timeOffReason: string;
    public status: Status;
    public employeeID: number; //FK

    constructor(
        id: number,
        startDate: Date,
        endDate: Date,
        timeOffReason: string,
        status: Status,
        employeeID: number,
    ) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeOffReason = timeOffReason;
        this.status = status;
        this.employeeID = employeeID;
    }

    createData(
        startDate: Date,
        endDate: Date,
        timeOffReason: string,
        employeeID: number,
    ) {
        this.id = -1;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeOffReason = timeOffReason;
        this.status = Status.Pending;
        this.employeeID = employeeID;
    }
}

enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Denied = "Denied",
}
