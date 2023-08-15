import { Binary } from '@angular/compiler';
import { MappingBase } from './MappingBase';

export interface Folder extends MappingBase {
    title?: string;
    path?: string;
    url?: string;
}        