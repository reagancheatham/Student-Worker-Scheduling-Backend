import { WeekDay } from "./WeekDay";

export default class ShiftTemplate {
    public id: number = -1; //PK
    public startDay: WeekDay;
    public endDay: WeekDay;
    public startTime: Date;
    public endTime: Date;
    public taskListID: number;
    public lastEmployeeID: number;
    public scheduleTemplateID: number;

    constructor(
        id: number,
        startDay: WeekDay,
        endDay: WeekDay,
        startTime: Date,
        endTime: Date,
        taskListID: number,
        lastEmployeeID: number,
        scheduleTemplateID: number
    ) {
        this.id = id;
        this.startDay = startDay;
        this.endDay = endDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.lastEmployeeID = lastEmployeeID;
        this.scheduleTemplateID = scheduleTemplateID
    }

    createData(
        startDay: WeekDay,
        endDay: WeekDay,
        startTime: Date,
        endTime: Date,
        taskListID: number,
        lastEmployeeID: number,
        scheduleTemplate: number
    ) {
        this.id = -1;
        this.startDay = startDay;
        this.endDay = endDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.taskListID = taskListID;
        this.lastEmployeeID = lastEmployeeID;
        this.scheduleTemplateID = scheduleTemplate;
    }
}

