import { EntityBase } from './EntityBase';

export interface Form extends EntityBase {
    title?: string;
    slug?: string;
    isPublish?: boolean;
    currentVersion?: string;
    publishedVersion?: string;
    availableVersion?: string;
}        