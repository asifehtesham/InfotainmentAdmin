import { DateTime } from "luxon";

export interface EntityBase {

    id?: number;
    CreateDate?: DateTime;
    LastEditDate?: DateTime;
    CreatedBy?: number;
    LastEditBy?: number;

    
    sortOrder?: number;
    active?: boolean;
    IsActive?: boolean;
}