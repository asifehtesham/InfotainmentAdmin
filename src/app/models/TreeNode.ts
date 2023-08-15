import { Time } from '@angular/common';

export interface TreeNode {
    id: number;
    parent_id?: number;
    title: string;
    duration?: Time;
    iscompleted?: boolean;
    children?: TreeNode[];
    islock?: boolean;
    type: number; //1 = section, 2= Topic, 3 = Quiz
    topic_type?: number;
    isLoading?: boolean;
    url?: string;
}

export interface Activity {
    id: number;
    ParentID: number;
    Type: ActivityType;
    Child: any;

    Sort: number;
    Enabled: boolean;

    AvailabilityStart: Date;
    AvailabilityEnd: Date;

}

export enum ActivityType {
    "Topic" = 0,
    "Quiz" = 1,
    "Scrom" = 2,
    "LiveSession" = 3,
    "Exam" = 10,
    "Certificate" = 20,
}