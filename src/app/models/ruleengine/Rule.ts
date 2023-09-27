import { EntityBase } from "../EntityBase";
import { Params } from "./ScopedParam";
import { Workflow } from "./Workflow";

export interface Rule extends EntityBase {
  parentRuleId?: number;
  workflowRuleId?: number;
  ruleName: string;
  operator?: string;
  errorMessage?: string;
  enabled?: boolean;
  ruleExpressionType?: string;
  workflowsToInject?: Array<Workflow>;
  rules?: Array<Rule>;
  localParams?: Array<Params>;
  successEvent?: string;
  expression?: string;
}