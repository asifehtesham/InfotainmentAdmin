import { EntityBase } from "../EntityBase";
import { Params } from "./ScopedParam";
import { Workflow } from "./Workflow";


export interface Task extends EntityBase {
  workflowName?: string;
  parentWorkflowId?: number;
  parentRuleId?: number;
  workflowRuleId?: number;
  globalParams?: string;
  ruleName?: string;
  operator?: string;
  errorMessage?: string;
  enabled?: boolean;
  ruleExpressionType?: number;
  workflowsToInject?: Array<Workflow>;
  rules?: Array<Task>;
  localParams?: Array<Params>;
  successEvent?: string;
  expression?: string;
  prop?: any;

  email?: string;
  name?: string;
  subject?: string;
  body?: string;
  mobileNumber?: string;
  message?: string;
  url?: string;
  method?: string;
  userId?: string;
  emailTitle?: string;
  nameTitle?: string;
  subjectTitle?: string;
  bodyTitle?: string;
  mobileNumberTitle?: string;
  messageTitle?: string;
  urlTitle?: string;
  methodTitle?: string;
  userIdTitle?: string;
}