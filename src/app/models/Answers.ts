import { Attachment } from './Attachment';
import { Questions } from './Questions';
import { EntityBase } from "./EntityBase";

export interface Answers extends EntityBase {
    Title: string;
    TitleAR?: string;

    Description?: string;
    DescriptionAR?: string;
    Image?: Attachment;

    isCorrect?: boolean;
    Questions?: Questions;

    Grade?: number;
    Feedback?: string;
    MatchingText?: string;
    Sort?: number;
}
