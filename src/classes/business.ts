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

    static createData(name: string, address: string, city: string, state: string) {
        return new Business(-1, name, address, city, state);
    }
}
