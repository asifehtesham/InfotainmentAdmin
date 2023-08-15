import { EntityBase } from './EntityBase';

export interface Component extends EntityBase {
    Name: string;
    Content: string;
    isPublish: boolean;
}