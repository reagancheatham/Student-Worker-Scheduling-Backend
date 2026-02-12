export default class ShiftOfferRequest {
    public id: number = -1; //PK
    public offerMessage: string;
    public timeSent: Date;
    public shiftID: number; //FK

    constructor(
        id: number,
        offerMessage: string,
        timeSent: Date,
        shiftID: number,
    ) {
        this.id = id;
        this.offerMessage = offerMessage;
        this.timeSent = timeSent;
        this.shiftID = shiftID;
    }

    createData(offerMessage: string, shiftID: number) {
        this.id = -1;
        this.offerMessage = offerMessage;
        this.timeSent = new Date();
        this.shiftID = shiftID;
    }
}
