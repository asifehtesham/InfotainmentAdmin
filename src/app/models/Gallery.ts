import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Gallery extends EntityBase {
    Image?: Attachment;
    title: string;
    slug: string;
    content: string;

    availableStartDate: DateTime;
    availableEndDate: DateTime;

    isFeatured: boolean;
    isPublish: boolean;
    //currentVersion?: string;

}