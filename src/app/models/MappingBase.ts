import { EntityBase } from "./EntityBase";

export interface MappingBase extends EntityBase {
    referenceTable?: string;
    referenceColumn?: string;
    referenceEntityID?: string;
}