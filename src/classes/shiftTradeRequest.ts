export default class ShiftTradeRequest {
    public id: number = -1; //PK
    public tradeMessage: string;
    public timeSent: Date;
    public shiftID: number; //FK
    public targetEmployeeID: number; //FK

    constructor(
        id: number,
        tradeMessage: string,
        timeSent: Date,
        shiftID: number,
        targetEmployeeID: number,
    ) {
        this.id = id;
        this.tradeMessage = tradeMessage;
        this.timeSent = timeSent;
        this.shiftID = shiftID;
        this.targetEmployeeID = targetEmployeeID;
    }

    createData(
        tradeMessage: string,
        shiftID: number,
        targetEmployeeID: number,
    ) {
        this.id = -1;
        this.tradeMessage = tradeMessage;
        this.timeSent = new Date();
        this.shiftID = shiftID;
        this.targetEmployeeID = targetEmployeeID;
    }
}
