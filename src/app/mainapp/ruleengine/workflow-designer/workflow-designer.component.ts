import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HTMLDOMElement } from 'highcharts';
//import { Designer } from '@omneedia/workflow-designer/angular/node_modules/@angular/core';
//import { DesignerComponent  } from '@omneedia/workflow-designer/angular/designer/src/designer.component';
//import { Designer, } from '@omneedia/workflow-designer/designer';
import {
  Definition,
  Designer,
  GlobalEditorContext,
  Properties,
  Uid,
  Step,
  StepEditorContext,
  StepsConfiguration,
  ToolboxConfiguration,
  ValidatorConfiguration,
  SequentialStep,
  Branches,
  BranchedStep,
  StepChildren,
  Sequence
} from 'sequential-workflow-designer';
import { Rule } from 'src/app/models/ruleengine/Rule';
import { WorkflowRule } from 'src/app/models/ruleengine/WorkflowRule';
import { RuleService } from 'src/app/services/ruleengine/rules.service';
import { WorkflowService } from 'src/app/services/ruleengine/workflow.service';

import { MatDialog } from '@angular/material/dialog';
import { RuleDetailComponent } from '../rule-detail/rule-detail.component';



//import { Designer, } from '@omneedia/workflow-designer/designer/node_modules';
const configuration = {
  theme: 'light', // optional, default: 'light'
  isReadonly: false, // optional, default: false
  undoStackSize: 10, // optional, default: 0 - disabled, 1+ - enabled

  steps: {
    // all properties in this section are optional

    iconUrlProvider: (componentType, type) => {
      return `icon-${componentType}-${type}.svg`;
    },

    isDraggable: (step, parentSequence) => {
      return step.name !== 'y';
    },
    isDeletable: (step, parentSequence) => {
      return step.properties['isDeletable'];
    },
    isDuplicable: (step, parentSequence) => {
      return true;
    },
    canInsertStep: (step, targetSequence, targetIndex) => {
      return targetSequence.length < 5;
    },
    canMoveStep: (sourceSequence, step, targetSequence, targetIndex) => {
      return !step.properties['isLocked'];
    },
    canDeleteStep: (step, parentSequence) => {
      return step.name !== 'x';
    }
  },

  // validator: {
  //   // all validators are optional

  //   step: (step, parentSequence, definition) => {
  //     return /^[a-z]+$/.test(step.name);
  //   },
  //   root: (definition) => {
  //     return definition.properties['memory'] > 256;
  //   }
  // },

  toolbox: {
    isCollapsed: false,
    groups: [
      {
        name: 'Files',
        steps: [
          // steps for the toolbox's group
        ]
      },
      {
        name: 'Notification',
        steps: [
          // steps for the toolbox's group
        ]
      }
    ]
  },

  editors: {
    isCollapsed: false,
    globalEditorProvider: (definition, globalContext) => {
      const editor = document.createElement('div');
      // ...
      return editor;
    },
    stepEditorProvider: (step, stepContext, definition) => {
      const editor = document.createElement('div');
      // ...
      return editor;
    }
  },

  controlBar: true,
  contextMenu: true,
};


const definition = {
  properties: {
    'velocity': '0',
    // global properties...
  },

  sequence: [
    // root steps...
    {
      id: Uid.next(),
      componentType: 'task',
      name: 'Step',
      properties: { velocity: 0 },
      type: 'task'
    }
  ]
};
function createStep(name: string): Step {
  return {
    id: Uid.next(),
    componentType: 'task',
    name: name,
    properties: { velocity: 0 },
    type: 'task'
  };
}

function createRule(rule: Rule): SequentialStep {
  console.log("Rule id: ", rule.id.toString());
  return {
    componentType: 'container',
    id: Uid.next(),
    type: 'rule',
    name: rule.ruleName,
    properties: {
      id: rule.id,
      workflow_rule_id: rule.workflowRuleId,
      operator: rule.operator,
      errorMessage: rule.errorMessage,
      success_event: rule.successEvent,
      expression: rule.expression,
      enabled: rule.enabled,
      velocity: 1,
    },
    sequence: [
      // steps...
    ]
  };
}

function createSwitchRule(name: string): BranchedStep {
  return {
    componentType: 'container',
    id: '2a11d8498af26cdb67e2f27171e82f8easdsad',
    type: "branch",
    name: name,
    properties: {
      velocity: 1,
    },
    branches: {
      'true': [],
      'false': [],
      'false1': []
    }
  };
}


@Component({
  selector: 'app-workflow-designer',
  templateUrl: './workflow-designer.component.html',
  styleUrls: ['./workflow-designer.component.scss']
})


export class WorkflowDesignerComponent implements OnInit, AfterViewInit {

  @ViewChild('placeholder', { static: true }) private placeholder: ElementRef<HTMLDOMElement>;

  //let placeholder = document.getElementById('placeholder');
  id: number;
  rules: Array<Rule>;
  allRules: Array<Rule>;
  steps: Array<Step> = [];
  allsteps: Array<Step> = [];
  private designer?: Designer;

  workflowRule: WorkflowRule;
  preSeq: Array<Step>;

  public definition: Definition = this.createDefinition();
  public definitionJSON?: string;
  public isValid?: boolean;

  constructor(public router: Router,
    public route: ActivatedRoute,
    private workflowService: WorkflowService,
    private rulesService: RuleService,
    public ref: ChangeDetectorRef,
    private snakbar: MatSnackBar,
    private dialog: MatDialog,
  ) {
  }

  Operators: SelectModel[] = [
    { id: '0', viewValue: 'And' },
    { id: '1', viewValue: 'Or' }
  ];

  createDefinition(): Definition {
    return {
      properties: {
        velocity: 0
      },
      sequence: this.steps
    };
  }

  public toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      {
        name: 'Step',
        steps: this.allsteps //[createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")]
      }
    ]
  };


  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: () => './assets/angular-icon.svg'
  };
  public readonly validatorConfiguration: ValidatorConfiguration = {
    step: (step: Step) => !!step.name && Number(step.properties['velocity']) >= 0,
    root: (definition: Definition) => Number(definition.properties['velocity']) >= 0
  };

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    this.updateIsValid();
    console.log('designer ready', this.designer);
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateIsValid();
    this.updateDefinitionJSON();

    // console.log("changed");
    // console.log("this.preSeq", this.preSeq);
    console.log("this.definition", this.definition);

    //this.preSeq.filter(x=> this.definition.sequence.find(y=> y.id == x.id))
    var diff = this.definition.sequence.filter(x => !this.preSeq.find(y => y.id == x.id));
    console.log("diff: ", diff);

    var diff1 = this.preSeq.filter(x => !this.definition.sequence.find(y => y.id == x.id));
    console.log("diff: ", diff1);

    // let seq = [...this.definition.sequence];
    // let preSeq = [...this.preSeq];
    // let iFlag = false;
    // for (let i = 0; i < seq.length; i++) {

    //   iFlag = false;
    //   for (let j = 0; j < preSeq.length; j++) {
    //     if (seq[i].id == seq[j].id) {
    //       console.log("seq[j].id", seq[j].id);
    //       iFlag = false
    //     } else {
    //       iFlag = true
    //     }

    //     if (iFlag) {
    //       console.log("iFlag", iFlag);
    //       console.log("seq[j]", seq[j]);
    //     }
    //   }
    // }


    this.preSeq = this.definition.sequence;
    //console.log("id is", diff[0].properties['id']);
    //console.log("id type: ", typeof (diff[0].properties['id']));

    //Assign Rule
    if (diff.length > 0) {
      this.workflowRule = {
        worflowId: this.id,
        ruleId: parseInt(diff[0].properties['id'].toString())
      }

      this.workflowService.assignRule(this.workflowRule).subscribe(results => {
        //this.rules = results;
        console.log("workflow rules");
        //console.log(this.rules);
        diff[0].properties['workflow_rule_id'] = results.id;
        console.log(diff);
      });
    }
    //Remove Rules
    if (diff1.length > 0) {



      this.workflowService.removeRule(parseInt(diff1[0].properties['workflow_rule_id'].toString())).subscribe(results => {
        //this.rules = results;
        console.log("workflow rules");
      });
    }
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  public reloadDefinitionClicked() {
    this.definition = this.createDefinition();
    if (this.createDefinition()?.sequence) {
      this.preSeq = this.createDefinition()?.sequence;
    }
    //this.updateDefinitionJSON();
  }

  private reloadToolbox() {
    this.toolboxConfiguration = {
      groups: [
        {
          name: 'Step',
          steps: this.allsteps //[createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")]
        }
      ]
    };

  }

  private updateDefinitionJSON() {
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
  }

  private updateIsValid() {
    this.isValid = this.designer?.isValid();
  }
  ngAfterViewInit(): void {

    // const designer = Designer.create(this.placeholder.nativeElement, definition, configuration);
    // designer.onDefinitionChanged.subscribe((newDefinition) => {

    // });
  }

  async ngOnInit() {
    this.updateDefinitionJSON();
    // const designer = Designer.create(this.placeholder.nativeElement, definition, configuration);
    // designer.onDefinitionChanged.subscribe((newDefinition) => {

    // });

    //this.steps = [createStep('Step 1'), createStep('Step 2'), createRule('rule step')];
    //this.createDefinition();

    this.loadAllRules();
    //this.allsteps = [createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")];
    //this.reloadToolbox();
    //this.designer.updateBadges();


    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      this.loadData();
    });
  }

  loadAllRules() {

    this.rulesService.loadData().subscribe(results => {
      //this.loadEmptyMsg = true;
      this.allRules = results;
      console.log("all rules");
      console.log(this.allRules);
      this.allsteps = [];
      this.allRules.forEach(x => {
        this.allsteps.push(createRule(x));
      });
      //this.allsteps = [createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")];
      this.reloadToolbox();
      //this.setForm();
      //this.form = JSON.parse(this.formContent.formData);
    });

  }

  loadData() {

    this.workflowService.getRules(this.id).subscribe(results => {
      //this.loadEmptyMsg = true;
      this.rules = results;
      this.steps = [];
      this.rules.forEach(x => {
        this.steps.push(createRule(x));
      });
      this.reloadDefinitionClicked();
      console.log("workflow rules");
      console.log("this.definition.sequence", this.definition.sequence);
      //this.setForm();
      //this.form = JSON.parse(this.formContent.formData);
    });

  }


  AddNewRule() {
    const dialogRef = this.dialog.open(RuleDetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadAllRules();
      this.snakbar.open('Your record has been added successfully.', 'Ok', {
        duration: 2000,
      });
    });
  }










}
