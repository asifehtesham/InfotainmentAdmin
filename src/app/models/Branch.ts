import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Branch extends EntityBase {
    title: string;
    titleAr: string;
    imageURL: string;
    shortName: string;
    projectId: number;
    image?: Attachment;
}