import { Business } from "./business.ts";
import { User } from "./user.model.ts";
import { Task } from "./task.model.ts";
import { TaskList } from "./taskList.model.ts";
import { Settings } from "./settings.ts";
import { Employee } from "./employee.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { TimeOffRequest } from "./timeOffRequest.model.ts";
import { PermissionRole } from "./permissionRole.ts";
import { EmployeeUnavailability } from "./employeeUnavailability.ts";
import { Role } from "./role.ts";
import { Shift } from "./shift.model.ts";
import { ShiftOfferRequest } from "./shiftOfferRequest.model.ts";
import { ShiftTradeRequest } from "./shiftTradeRequest.model.ts";
import { TimeSheet } from "./timeSheet.model.ts";

User.belongsTo(PermissionRole, {
    foreignKey: "permissionRoleID",
});
PermissionRole.hasMany(User, {
    foreignKey: "permissionRoleID",
});

Employee.belongsTo(User, {
    foreignKey: "userID",
    onDelete: "CASCADE",
});
User.hasMany(Employee, {
    foreignKey: "userID",
    onDelete: "CASCADE",
});

Employee.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(Employee, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

Employee.hasMany(Role, {
    foreignKey: "roleID",
});
Role.belongsTo(Employee, {
    foreignKey: "roleID",
});

EmployeeUnavailability.belongsTo(Employee, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});
Employee.hasMany(EmployeeUnavailability, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});

Role.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(Role, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

ScheduleTemplate.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(ScheduleTemplate, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

Settings.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasOne(Settings, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

Shift.hasOne(TaskList, {
    foreignKey: "taskListID",
});
TaskList.belongsTo(TaskList, {
    foreignKey: "taskListID",
});

Shift.belongsTo(Employee, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});
Employee.hasMany(Shift, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});

ShiftOfferRequest.hasOne(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.belongsTo(ShiftOfferRequest, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});

ShiftTradeRequest.hasOne(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.belongsTo(ShiftTradeRequest, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});

ShiftTradeRequest.hasOne(Employee, {
    foreignKey: "targetEmployeeID",
});
Employee.belongsTo(ShiftTradeRequest, {
    foreignKey: "targetEmployeeID",
});

Task.belongsTo(TaskList, {
    foreignKey: "taskListID",
    onDelete: "CASCADE",
});
TaskList.hasMany(Task, {
    foreignKey: "taskListID",
    onDelete: "CASCADE",
});

TaskList.belongsTo(Business, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});
Business.hasMany(TaskList, {
    foreignKey: "businessID",
    onDelete: "CASCADE",
});

TimeOffRequest.belongsTo(Employee, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});
Employee.hasMany(TimeOffRequest, {
    foreignKey: "employeeID",
    onDelete: "CASCADE",
});

TimeSheet.belongsTo(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.hasOne(TimeSheet, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
