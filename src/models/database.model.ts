import { ForeignKey } from "sequelize-typescript";
import sequelizeInstance from "../database/sequelizeInstance";
import Business from "./business.model";
import Employee from "./employee.model";
import EmployeeUnavailability from "./employeeUnavailability.model";
import PermissionRole from "./permissionRole.model";
import Role from "./role.model";
import ScheduleTemplate from "./scheduleTemplate.model";
import Setting from "./setting.model";
import Shift from "./shift.model";
import ShiftOfferRequest from "./shiftOfferRequest.model";
import ShiftTemplate from "./shiftTemplate.model";
import ShiftTradeRequest from "./shiftTradeRequest.model";
import Task from "./Task.model";
import TaskList from "./TaskList.model";
import TimeOffRequest from "./timeOffRequest.model";
import TimeSheet from "./timeSheet.model";
import User from "./user.model";

//EMployee <-> User
Employee.belongsTo(User, {
    foreignKey: "userID",
    onDelete: "CASCADE",
});
User.hasOne(Employee, {
    foreignKey: "userID",
    onDelete: "CASCADE",
});

//Employee <-> Business
Employee.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(Employee, { 
    foreignKey: "businessID", 
    onDelete: "CASCADE",
});

//Employee <-> PermissionRole
Employee.belongsTo(PermissionRole, {
    foreignKey: "permissionRoleID",
});
PermissionRole.hasMany(Employee, {
    foreignKey: "permissionRoleID",
})

//Employee <-> RoleID
Employee.hasMany(Role, {
    foreignKey: "roleID",
});
Role.belongsTo(Employee, {
    foreignKey: "roleID",
});

//EmployeeUnavailability <-> Employee
EmployeeUnavailability.belongsTo(Employee, {
    foreignKey: "employeeID", 
    onDelete: "CASCADE",
});
Employee.hasMany(EmployeeUnavailability, {
    foreignKey: "employeeID",
    onDelete: "CASCADE"
});

//Role <-> Business
Role.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(Role, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

//ScheduleTemplate <-> Business
ScheduleTemplate.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(ScheduleTemplate, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

//Setting <-> Business
Setting.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasOne(Setting, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

//Shift <-> TaskList
Shift.hasOne(TaskList, {
    foreignKey: "taskListID",
});
TaskList.belongsTo(TaskList, {
    foreignKey: "taskListID",
})

//Shift <-> Employee
Shift.belongsTo(Employee, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});
Employee.hasMany(Shift, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});

//ShiftOfferRequest <-> Shift
ShiftOfferRequest.hasOne(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.belongsTo(ShiftOfferRequest, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});

//ShiftTemplate <-> TaskList
ShiftTemplate.hasOne(TaskList, {
    foreignKey: "taskListID",
});
TaskList.belongsTo(ShiftTemplate, {
    foreignKey: "taskListID",
});

//ShiftTemplate <-> Employee
ShiftTemplate.hasOne(Employee, {
    foreignKey: "lastEmployeeID",
});
Employee.belongsTo(ShiftTemplate, {
    foreignKey: "lastEmployeeID",
});

//ShiftTemplate <-> ScheduleTemplate
ShiftTemplate.belongsTo(ScheduleTemplate, {
    foreignKey: "scheduleTemplateID",
});
ScheduleTemplate.hasMany(ShiftTemplate, {
    foreignKey: "scheduleTemplateID",
});

//ShiftTradeRequest <-> Shift
ShiftTradeRequest.hasOne(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.belongsTo(ShiftTradeRequest, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});

//ShiftTradeRequest <-> EMployee
ShiftTradeRequest.hasOne(Employee, {
    foreignKey: "targetEmployeeID",
});
Employee.belongsTo(ShiftTradeRequest, {
    foreignKey: "targetEmployeeID",
})

//Task <-> TaskList
Task.belongsTo(TaskList, {
    foreignKey: "taskListID",
    onDelete: "CASCADE",
});
TaskList.hasMany(Task, {
    foreignKey: "taskListID",
    onDelete: "CASCADE",
});

//TaskList <-> Business
TaskList.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(TaskList, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

//TimeOffRequest <-> Employee
TimeOffRequest.belongsTo(Employee, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});
Employee.hasMany(TimeOffRequest, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});

//TimeSheet <-> Shift
TimeSheet.belongsTo(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.hasOne(TimeSheet, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});

export default sequelizeInstance;