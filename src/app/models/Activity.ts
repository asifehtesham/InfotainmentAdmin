import { DateTime } from "luxon";
import { MappingBase } from "./MappingBase";

export interface Activity extends MappingBase {
    ParentID: number;
    Type: ActivityType;

    Sort: number;
    Enabled: boolean;

    AvailabilityStart: DateTime;
    AvailabilityEnd: DateTime;

    Child: any;
}

export enum ActivityType {
    "Topic" = 1,
    "Quiz" = 2,
    "Scrom" = 3,
    "LiveSession" = 4,
    "Assignment" = 5,
    "Exam" = 10,
    "Certificate" = 20
}