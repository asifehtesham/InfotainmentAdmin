import { Attachment } from './Attachment';
import { Answers } from './Answers';
import { EntityBase } from './EntityBase';

export interface Questions extends EntityBase {
    Tags?: string;
    Title: string;
    TitleAR?: string;

    Description?: string;
    DescriptionAR?: string;
    Image?: Attachment;

    Answers?: Answers[];

    QuestionType?: QuestionType;
    DefaultMark?: number;
    CombinedFeedBackForCorrectAnswer?: string;
    CombinedFeedBackForWrongAnswer?: string;
    AllowMultipleAnswer?: boolean;
    Shuffle?: boolean;

}

export enum QuestionType {
    "Multiple Choices" = 0,
    "True False" = 1,
    "Short Answer" = 2,
    "Numerical" = 3,
    "Essay" = 4,
    "Matching" = 5,
    "Drag into Text" = 6
}