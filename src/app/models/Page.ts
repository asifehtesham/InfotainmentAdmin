import { Attachment } from './Attachment';
import { EntityBase } from './EntityBase';

export interface Page extends EntityBase {
    title: string;
    slug: string;
    SelectedTemplate?: number;
    isPublish?: boolean;
    currentVersion?: string;
    image?: Attachment;
}