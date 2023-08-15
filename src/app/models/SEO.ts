import { EntityBase } from './EntityBase';
import { MappingBase } from './MappingBase';

export interface SEO extends MappingBase {
    MetaName: string;
    MetaContent: string;
}