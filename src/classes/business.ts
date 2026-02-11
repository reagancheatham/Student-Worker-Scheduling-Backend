export default class Business {
    public id: number = -1; //PK
    public name: string;
    public address: string;
    public city: string;
    public state: string;

    constructor(
        id: number,
        name: string,
        address: string,
        city: string,
        state: string,
    ) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
    }

    createData(name: string, address: string, city: string, state: string) {
        this.id = -1;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
    }
}
