import { Business } from "./business.ts";
import { Employee } from "./employee.ts";
import { EmployeeUnavailability } from "./employeeUnavailability.ts";
import { Manager } from "./manager.ts";
import { PermissionRole } from "./permissionRole.ts";
import { Role } from "./role.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { Session } from "./session.ts";
import { Settings } from "./settings.ts";
import { Shift } from "./shift.model.ts";
import { ShiftOfferRequest } from "./shiftOfferRequest.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { ShiftTaskTemplate } from "./shiftTaskTemplate.ts";
import { ShiftTradeRequest } from "./shiftTradeRequest.ts";
import { Task } from "./task.ts";
import { TaskList } from "./taskList.ts";
import { TaskListTemplate } from "./taskListTemplate.ts";
import { TaskTemplate } from "./taskTemplate.ts";
import { TimeOffRequest } from "./timeOffRequest.ts";
import { Timesheet } from "./timesheet.ts";
import { User } from "./user.ts";

Session.belongsTo(User, {
    foreignKey: "userID",
});
User.hasMany(Session, {
    foreignKey: "userID",
});

User.hasOne(PermissionRole, {
    foreignKey: "permissionRoleID",
});

Manager.belongsTo(User, {
    foreignKey: "userID",
});
Manager.belongsTo(Business, {
    foreignKey: "businessID",
});

Employee.hasOne(User, {
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


