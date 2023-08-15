// import { EntityBase } from './EntityBase';
import { DateTime } from "luxon";

export interface PageComponent {
  // ID: number;
  id: number;
  title?: string;
  slug?: string;
  html?: string;
  css?: string;
  pageData?: string;
  customCSS?: string;
  customJS?: string;
  cdnLinks?: string;
  createDate?: DateTime;
  lastEditDate?: DateTime;
  createdBy?: number;
  lastEditBy?: number;
  isActive?: boolean;
}
