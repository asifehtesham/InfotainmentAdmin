import { Attachment } from './Attachment';
import { Questions } from './Questions';
import { Time } from '@angular/common';
import { Period } from './Period';
import { EntityBase } from './EntityBase';

export interface Quiz extends EntityBase {
    Tags?: string;
    Title: string;
    TitleAR?: string;

    Description?: string;
    DescriptionAR?: string;
    Image?: Attachment;

    Questions?: Questions[];

    isOptional?: boolean;
    TotalMarks?: number;
    PassingPercent?: number;
    TimeDuration?: Time;

    AllowedAttempts?: number;
    GradingMethod?: GradingMethod;

    QuestionTime?: Time;
    Duration?: Period;

    RandomizeQuestion?: boolean
    ShowQuizSummary?: boolean;
    ShowCorrectAnswerInSummary?: boolean;
    ShowCorrectAnswerAfterEachQuestionSubmit?: boolean;
    CanGotoPreviousQuestion?: boolean;

    TotalQuestion?: number;
    UserProgress?: number;

}


export enum GradingMethod {

    "HighestMarks" = 1,
    "AverageMarks" = 2,
    "FirstMarks" = 3,
    "LastMarks" = 4
}
