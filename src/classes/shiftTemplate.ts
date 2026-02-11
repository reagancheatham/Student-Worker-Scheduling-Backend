import { DaysOfWeek } from "../util/DaysOfWeek";

export default class ShiftTemplate {
    public id: number = -1; //PK
    public startDay: DaysOfWeek;
    public endDay: DaysOfWeek;
    public startTime: Date;
    public endTime: Date;
    public taskListID: number;
    public lastEmployeeID: number;

    constructor(
        id: number,
        startDay: DaysOfWeek,
        endDay: DaysOfWeek,
        startTime: Date,
        endTime: Date,
        taskListID: number,
        lastEmployeeID: number,
    ) {
        this.id = id;
        this.startDay = startDay;
        this.endDay = endDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.lastEmployeeID = lastEmployeeID;
    }

    createData(
        startDay: DaysOfWeek,
        endDay: DaysOfWeek,
        startTime: Date,
        endTime: Date,
        taskListID: number,
        lastEmployeeID: number,
    ) {
        this.id = -1;
        this.startDay = startDay;
        this.endDay = endDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.lastEmployeeID = lastEmployeeID;
    }
}

