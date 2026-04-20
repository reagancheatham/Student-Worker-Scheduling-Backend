import { Employee } from "./employee.ts";
import { Business } from "./business.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { Invite } from "./invite.ts";
import { EmployeeUnavailability } from "./employeeUnavailability.ts";
import { PermissionRole } from "./permissionRole.ts";
import { Role } from "./role.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { Session } from "./session.ts";
import { Settings } from "./settings.ts";
import { Shift } from "./shift.ts";
import { ShiftOfferRequest } from "./shiftOfferRequest.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { ShiftTaskTemplate } from "./shiftTaskTemplate.ts";
import { ShiftTradeRequest } from "./shiftTradeRequest.ts";
import { Task } from "./task.ts";
import { TaskCheckOff } from "./taskCheckOff.ts";
import { TaskList } from "./taskList.ts";
import { TaskListTemplate } from "./taskListTemplate.ts";
import { TaskTemplate } from "./taskTemplate.ts";
import { TimeOffRequest } from "./timeOffRequest.ts";
import { Timesheet } from "./timesheet.ts";
import { User } from "./user.ts";
import { EmployeeRole } from "./employeeRole.ts";

Session.belongsTo(User, {
    foreignKey: "userID",
});
User.hasMany(Session, {
    foreignKey: "userID",
});

PermissionRole.hasOne(User, {
    foreignKey: "permissionRoleID",
});

BusinessPermissionRole.hasMany(Employee, {
    foreignKey: "businessPermissionRoleID",
});
Employee.belongsTo(BusinessPermissionRole, {
    foreignKey: "businessPermissionRoleID",
});

Business.hasMany(Invite, {
    foreignKey: "businessID",
});
Invite.belongsTo(Business, {
    foreignKey: "businessID",
});

BusinessPermissionRole.hasMany(Invite, {
    foreignKey: "businessPermissionRoleID",
});
Invite.belongsTo(BusinessPermissionRole, {
    foreignKey: "businessPermissionRoleID",
});

Employee.belongsTo(User, {
    foreignKey: "userID",
});
User.hasMany(Employee, {
    foreignKey: "userID",
});

Employee.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasMany(Employee, {
    foreignKey: "businessID",
});

Employee.belongsToMany(Role, {
    through: EmployeeRole,
    foreignKey: "employeeID",
    otherKey: "roleID",
});
Role.belongsToMany(Employee, {
    through: EmployeeRole,
    foreignKey: "roleID",
    otherKey: "employeeID",
});

Settings.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasOne(Settings, {
    foreignKey: "businessID",
});

EmployeeUnavailability.belongsTo(Employee, {
    foreignKey: "employeeID",
});
Employee.hasMany(EmployeeUnavailability, {
    foreignKey: "employeeID",
});

TimeOffRequest.belongsTo(Employee, {
    foreignKey: "employeeID",
});
Employee.hasMany(TimeOffRequest, {
    foreignKey: "employeeID",
});

Role.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasMany(Role, {
    foreignKey: "businessID",
});

ScheduleTemplate.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasMany(ScheduleTemplate, {
    foreignKey: "businessID",
});

ScheduleShiftTemplate.belongsTo(ScheduleTemplate, {
    foreignKey: "scheduleTemplateID",
});
ScheduleTemplate.hasMany(ScheduleShiftTemplate, {
    foreignKey: "scheduleTemplateID",
});

ScheduleShiftTemplate.belongsTo(Employee, {
    foreignKey: "employeeID",
});
Employee.hasMany(ScheduleShiftTemplate, {
    foreignKey: "employeeID",
});

ShiftTaskListTemplate.belongsTo(ScheduleShiftTemplate, {
    foreignKey: {
        name: "scheduleShiftID",
        allowNull: true,
    },
    onDelete: "SET NULL",
});
ScheduleShiftTemplate.hasOne(ShiftTaskListTemplate, {
    foreignKey: "scheduleShiftID",
});

ShiftTaskTemplate.belongsTo(ShiftTaskListTemplate, {
    foreignKey: "shiftTaskListID",
});
ShiftTaskListTemplate.hasMany(ShiftTaskTemplate, {
    foreignKey: "shiftTaskListID",
});

TaskListTemplate.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasMany(TaskListTemplate, {
    foreignKey: "businessID",
});

TaskTemplate.belongsTo(TaskListTemplate, {
    foreignKey: "taskListTemplateID",
});
TaskListTemplate.hasMany(TaskTemplate, {
    foreignKey: "taskListTemplateID",
});

Shift.belongsTo(Business, {
    foreignKey: "businessID",
});
Business.hasMany(Shift, {
    foreignKey: "businessID",
});

Shift.belongsTo(Employee, {
    foreignKey: {
        name: "employeeID",
        allowNull: true,
    },
    onDelete: "SET NULL",
});
Employee.hasMany(Shift, {
    foreignKey: "employeeID",
});

Shift.belongsTo(Role, {
    foreignKey: {
        name: "targetRoleID",
        allowNull: true,
    },
    onDelete: "SET NULL",
});
Role.hasMany(Shift, {
    foreignKey: "targetRoleID",
});

Timesheet.belongsTo(Shift, {
    foreignKey: "shiftID",
});
Shift.hasOne(Timesheet, {
    foreignKey: "shiftID",
});

ShiftTradeRequest.belongsTo(Shift, {
    foreignKey: "shiftID",
});
Shift.hasMany(ShiftTradeRequest, {
    foreignKey: "shiftID",
});

Employee.hasMany(ShiftTradeRequest, {
    foreignKey: "targetEmployeeID",
});

ShiftOfferRequest.belongsTo(Shift, {
    foreignKey: "shiftID",
});
Shift.hasMany(ShiftOfferRequest, {
    foreignKey: "shiftID",
});

TaskList.belongsTo(Shift, {
    foreignKey: "shiftID",
    onDelete: "CASCADE",
});
Shift.hasOne(TaskList, {
    foreignKey: "shiftID",
});

Task.belongsTo(TaskList, {
    foreignKey: "taskListID",
    onDelete: "CASCADE",
});
TaskList.hasMany(Task, {
    foreignKey: "taskListID",
});

TaskCheckOff.belongsTo(Task, {
    foreignKey: "taskID",
    onDelete: "CASCADE",
});
Task.hasMany(TaskCheckOff, {
    foreignKey: "taskID",
});

TaskCheckOff.belongsTo(Employee, {
    foreignKey: "sourceEmployeeID",
    onDelete: "SET NULL",
});
Employee.hasMany(TaskCheckOff, {
    foreignKey: "sourceEmployeeID",
});
