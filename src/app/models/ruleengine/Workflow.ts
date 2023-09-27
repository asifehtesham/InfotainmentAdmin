import { EntityBase } from "../EntityBase";
import { Rule } from "./Rule";
import { Params } from "./ScopedParam";

export interface Workflow extends EntityBase {

    workflowName: string;
    parentWorkflowId?: number;
    rule_expression_type?: string;
    workflows_to_inject?: Array<Workflow>;
    global_params?: Params;
    rules?: Array<Rule>;
}