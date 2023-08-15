import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Comments extends EntityBase {
    blogId: any;
    children: Comments[];
    parentId: any;
    userId: any;
    comment: string;
    isApproved: boolean,
    likes: any;
    user:any;
    dislikes: any;
}