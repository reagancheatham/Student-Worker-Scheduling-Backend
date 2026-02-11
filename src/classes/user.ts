export default class User {
    public id: number = -1; //PK
    public firstName: string;
    public lastName: string;
    public email: string;
    public phoneNumber: string;
    public address: string;
    public city: string;
    public state: string;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        address: string,
        city: string,
        state: string,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.state = state;
    }

    static createData(
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        address: string,
        city: string,
        state: string,
    ): User {
        return new User(
            -1,
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            city,
            state,
        );
    }
}
