import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Service extends EntityBase {

    image?: Attachment;
    title: string;
    isPublish: boolean;
    content: string; 
    availableStartDate: DateTime;
    availableEndDate: DateTime;
    links:any;
}
    