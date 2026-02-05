export default class Shift {
    public id: number = -1; //PK
    public startTime: Date;
    public endTime: Date;
    public taskListID: number; //FK
    public employeeID: number; //FK

    constructor(
        id: number,
        startTime: Date,
        endTime: Date,
        taskListID: number,
        employeeID: number,
    ) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.employeeID = employeeID;
    }

    createData(
        startTime: Date,
        endTime: Date,
        taskListID: number,
        employeeID: Number
    ) {
        this.id = -1;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.employeeID = this.employeeID;
    }
}
