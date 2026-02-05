export default class Employee {
    public id: number = -1; //PK
    public userID: number; //FK
    public businessID: number; //FK
    public permissionRoleID: number; //FK
    public roleID: number | null; //FK
    public studentID: number | null;
    public hourlyPayRate: number | null;

    constructor(
        id: number,
        userID: number,
        businessID: number,
        permissionRoleID: number,
        roleID: number,
        studentID: number,
        hourlyPayRate: number,
    ) {
        this.id = id;
        this.userID = userID;
        this.businessID = businessID;
        this.permissionRoleID = permissionRoleID;
        this.roleID = roleID;
        this.studentID = studentID;
        this.hourlyPayRate = hourlyPayRate;
    }

    createData(userID: number, businessID: number, permissionRoleID: number) {
        this.id = -1;
        this.userID = userID;
        this.businessID = businessID;
        this.permissionRoleID = permissionRoleID;
    }
}
