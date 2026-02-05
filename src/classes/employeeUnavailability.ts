export default class EmployeeUnavailability {
    public id: number = -1; //PK
    public startTime: Date;
    public endTime: Date;
    public employeeID: number; //FK

    constructor(
        id: number,
        startTime: Date,
        endTime: Date,
        employeeID: number,
    ) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.employeeID = employeeID;
    }

    createData(startTime: Date, endTime: Date, employeeID: number) {
        this.id = -1;
        this.startTime = startTime;
        this.endTime = endTime;
        this.employeeID = employeeID;
    }
}
