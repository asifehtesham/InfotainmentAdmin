import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Events extends EntityBase {
    Image?: Attachment;
    title: string;
    description: string;
    color: string;
    allDay: boolean;

    startDate: DateTime;
    endDate: DateTime;

    isPublish: boolean;
}