import { EntityBase } from "../EntityBase";
import { Params } from "./ScopedParam";
import { Workflow } from "./Workflow";


export interface Rule extends EntityBase {
  workflowName?:string;
  parentWorkflowId?:number;
  parentRuleId?: number;
  workflowRuleId?: number;
  globalParams?:string;
  ruleName?: string;
  operator?: string;
  errorMessage?: string;
  enabled?: boolean;
  ruleExpressionType?: number;
  workflowsToInject?: Array<Workflow>;
  rules?: Array<Rule>;
  localParams?: Array<Params>;
  successEvent?: string;
  expression?: string;
  prop?:any;
}