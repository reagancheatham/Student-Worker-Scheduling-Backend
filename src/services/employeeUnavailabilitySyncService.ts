import { Op } from "sequelize";
import { EmployeeUnavailability } from "../models/employeeUnavailability.ts";
import { StudentScheduleService } from "./studentScheduleService.ts";

export type StudentScheduleIdentity = {
    studentID?: number | null;
    email?: string | null;
};

export type EmployeeUnavailabilitySyncResult = {
    success: boolean;
};

export class EmployeeUnavailabilitySyncService {
    public static async syncForEmployee(
        employeeID: number,
        userIdentity: StudentScheduleIdentity,
        termCode: string,
    ): Promise<EmployeeUnavailabilitySyncResult | null> {
        const userID = this.resolveStudentApiUserID(userIdentity);

        if (!userID) {
            return null;
        }

        const blocks = await StudentScheduleService.loadEmployeeUnavailabilityFromSchedule(
            employeeID,
            userID,
            termCode,
        );

        const existingBlocks = await EmployeeUnavailability.findAll({
            where: {
                employeeID,
                term: termCode,
            },
        });

        const signatureForRange = (start: Date, end: Date): string =>
            `${start.toISOString()}|${end.toISOString()}`;

        const existingByRange = new Map<string, EmployeeUnavailability>();
        for (const existingBlock of existingBlocks) {
            existingByRange.set(
                signatureForRange(existingBlock.startTime, existingBlock.endTime),
                existingBlock,
            );
        }

        const blocksToInsert: Pick<
            EmployeeUnavailability,
            "employeeID" | "name" | "startTime" | "endTime" | "term"
        >[] = [];
        const blockNamesToUpdate: Array<{ id: number; name: string }> = [];
        const incomingRanges = new Set<string>();

        for (const block of blocks) {
            const rangeSignature = signatureForRange(block.startTime, block.endTime);
            incomingRanges.add(rangeSignature);

            const existingBlock = existingByRange.get(rangeSignature);

            if (!existingBlock) {
                blocksToInsert.push(block);
                continue;
            }

            if (existingBlock.name !== block.name) {
                blockNamesToUpdate.push({
                    id: existingBlock.id,
                    name: block.name,
                });
            }
        }

        const blockIDsToDelete = existingBlocks
            .filter((existingBlock) => !incomingRanges.has(signatureForRange(existingBlock.startTime, existingBlock.endTime)))
            .map((existingBlock) => existingBlock.id);

        if (blockIDsToDelete.length > 0) {
            await EmployeeUnavailability.destroy({
                where: {
                    id: {
                        [Op.in]: blockIDsToDelete,
                    },
                },
            });
        }

        if (blocksToInsert.length > 0) {
            await EmployeeUnavailability.bulkCreate(blocksToInsert, {
                ignoreDuplicates: true,
            });
        }

        for (const blockNameUpdate of blockNamesToUpdate) {
            await EmployeeUnavailability.update(
                { name: blockNameUpdate.name },
                {
                    where: {
                        id: blockNameUpdate.id,
                    },
                },
            );
        }

        return {
            success: true,
        };
    }

    public static resolveStudentApiUserID(
        userIdentity?: StudentScheduleIdentity,
    ): string | null {
        if (!userIdentity) return null;

        if (Number.isInteger(userIdentity.studentID) && userIdentity.studentID > 0 && userIdentity.studentID !== 111111) {
            return String(userIdentity.studentID);
        }

        if (typeof userIdentity.email === "string" && userIdentity.email.trim().length > 0) {
            return userIdentity.email.trim();
        }

        return null;
    }
}