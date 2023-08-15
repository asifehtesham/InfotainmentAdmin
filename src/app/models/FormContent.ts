import { EntityBase } from './EntityBase';

export interface FormContent extends EntityBase {
    formId?: string;
    formData?: string;
    isPublish?: boolean;
    version?: string;
}        