export default class TaskList {
    public id: number = -1; //PK
    public name: string;
    public businessID: number; //FK

    constructor(id: number, name: string, businessID: number) {
        this.id = id;
        this.name = name;
        this.businessID = businessID;
    }

    createData(name: string, businessID: number) {
        this.id = -1;
        this.name = name;
        this.businessID = businessID;
    }
}
