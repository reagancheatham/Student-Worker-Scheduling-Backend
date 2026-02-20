import { Business } from "./business.model.ts";
import { Employee } from "./employee.model.ts";
import { EmployeeUnavailability } from "./employeeUnavailability.model.ts";
import { PermissionRole } from "./permissionRole.model.ts";
import { Role } from "./role.model.ts";
import { ScheduleTemplate } from "./scheduleTemplate.model.ts";
import { Setting } from "./setting.model.ts";
import { Shift } from "./shift.model.ts";
import { ShiftOfferRequest } from "./shiftOfferRequest.model.ts";
import { ShiftTemplate } from "./shiftTemplate.model.ts";
import { ShiftTradeRequest } from "./shiftTradeRequest.model.ts";
import { Task } from "./task.model.ts";
import { TaskList } from "./taskList.model.ts";
import { TimeOffRequest } from "./timeOffRequest.model.ts";
import { TimeSheet } from "./timeSheet.model.ts";
import { User } from "./user.model.ts";

//Employee <-> User
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
});

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
    onDelete: "CASCADE",
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
});

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
});

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
