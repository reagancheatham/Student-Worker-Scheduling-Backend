import { TaskStatus } from "../util/TaskStatus.ts";

export default class Task {
    public id: number = -1; //PK
    public name: string;
    public completeStatus: TaskStatus;
    public taskListID: number; //FK

    constructor(id: number, name: string, completeStatus: TaskStatus, taskListID: number){
        this.id = id;
        this.name = name;
        this.completeStatus = completeStatus;
        this.taskListID = taskListID;
    }

    createData(name: string, taskListID: number) {
        this.id = -1;
        this.name = name;
        this.completeStatus = TaskStatus.Incomplete;
        this.taskListID = taskListID;
    }
}
