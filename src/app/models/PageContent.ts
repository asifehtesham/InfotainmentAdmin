// import { EntityBase } from './EntityBase';
import { DateTime } from "luxon";

export interface PageContent {
    ID: number;
    id: number;
    pageId: number;
    html?: string;
    css?: string;
    pageData?: string;
    customCSS?: string;
    customJS?: string;
    cdnLinks?: string;
    version?: string;
    CreateDate?: DateTime;
    LastEditDate?: DateTime;
    CreatedBy?: number;
    LastEditBy?: number;
    IsActive?: boolean;
}