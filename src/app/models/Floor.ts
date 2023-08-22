import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Floor extends EntityBase {
    title: string;
    titleAr: string;
    imageURL: string;
    branchId?:number;
    image?: Attachment;
}