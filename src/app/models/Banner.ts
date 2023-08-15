import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Banner extends EntityBase {
    image?: Attachment;
    title: string;
    link: string;
    linkText: string;
    content: string;

    availableStartDate: DateTime;
    availableEndDate: DateTime;

    isPublish: boolean;
    currentVersion?: string;
}