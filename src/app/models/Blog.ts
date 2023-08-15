import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Blog extends EntityBase {
    image?: Attachment;
    title: string;
    slug: string;
    isPublish: boolean;
    content: string;
    categoryId:number;
    // templateId:number;
    authorId: number;
    availableStartDate: DateTime;
    availableEndDate: DateTime;
    isFeatured: boolean;
    canComment: boolean;
    comments:any;
    templateSlug:string;
}