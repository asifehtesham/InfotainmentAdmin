import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Poll extends EntityBase {

    image?: Attachment;
    title: string;
    slug: string;
    isPublish: boolean;
    content: string; 
    availableStartDate: DateTime;
    availableEndDate: DateTime;
    canVisitorVote: boolean;
    canVoterSeeResult:boolean;
    options:any;
}
    