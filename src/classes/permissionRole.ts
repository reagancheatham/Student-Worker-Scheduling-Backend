export default class PermissionRole {
    public id: number = -1 //PK
    public role: string;

    constructor (id: number, role: string) {
        this.id = id;
        this.role = role;
    }
}