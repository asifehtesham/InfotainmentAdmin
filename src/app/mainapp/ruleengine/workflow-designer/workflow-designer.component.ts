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
import { Task } from 'src/app/models/ruleengine/Task';



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
      operatorTitle: 'Operator',
      errorMessageTitle: 'Error Message',
      success_event_title: 'Success Event',
      expression_title: 'Expression',
      enabled_title: 'Enabled'
    },
    sequence: [
      // steps...
    ]
  };
}



function createTask(rule: Task): SequentialStep {
  console.log("Rule id: ", rule.id.toString());
  
  
  console.log("rule ... .. ",rule);
  
  let res =  {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: rule.ruleName,
    properties: {...rule.prop},
    sequence: [
      // steps...
    ]
  };
  
  console.log("res .. .. .. ",res);
  return res;
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
  tasks: Array<Task>;

  steps: Array<Step> = [];
  allsteps: Array<Step> = [];
  tasklist: Array<Step> = [];






  private designer?: Designer;

  workflowRule: WorkflowRule;
  preSeq: Array<Step>;

  public definition: Definition = this.createDefinition();


  public response: Definition;


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






  createIfStep(id, _true, _false) {
    return {
      id,
      componentType: 'switch',
      type: 'if',
      name: 'If',
      branches: {
        'true': _true,
        'false': _false
      },
      properties: {}
    };
  }





  public toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      {
        name: 'Step',
        steps: this.allsteps //[createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")]
      },
      {
        name: 'Logic',
        steps: [
          this.createIfStep(null, [], []),
        ]
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

    console.log('changed', definition);


    this.response = definition;
    this.updateIsValid();
    this.updateDefinitionJSON();



    // Assign and Remove Workflow
    // var diff = this.definition.sequence.filter(x => !this.preSeq.find(y => y.id == x.id));
    // var diff1 = this.preSeq.filter(x => !this.definition.sequence.find(y => y.id == x.id));
    // this.preSeq = this.definition.sequence;
    // if (diff.length > 0) {
    //   this.workflowRule = {
    //     worflowId: this.id,
    //     ruleId: parseInt(diff[0].properties['id'].toString())
    //   }
    //   this.workflowService.assignRule(this.workflowRule).subscribe(results => {
    //     diff[0].properties['workflow_rule_id'] = results.id;
    //   });
    // }
    // if (diff1.length > 0) {
    //   this.workflowService.removeRule(parseInt(diff1[0].properties['workflow_rule_id'].toString())).subscribe(results => {
    //   });
    // }



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
          name: 'Rules',
          steps: this.allsteps //[createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")]
        },

        {
          name: 'Tasks',
          steps: this.tasklist
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


      this.tasks = [
        {
          "parentRuleId": 0,
          "workflowRuleId": 16,
          "ruleName": "Email",
          "id": 4,
          "active": false,
          "sortOrder": 0,
          "prop": {
            'email': 'test@email.com',
            'name': 'test name',
            'subject': 'test subject',
            'body':'test body',
            'emailTitle': 'Email',
            'nameTitle': 'Name',
            'subjectTitle': 'Subject',
            'bodyTitle': 'Title'
          }
        },
        {
          "parentRuleId": 0,
          "workflowRuleId": 16,
          "ruleName": "Api Call",
          "id": 4,
          "active": false,
          "sortOrder": 0,
          "prop": {
            'url': 'http://test.com/api',
            'urlTitle':'URL',
            'method': 'POST',
            'methodTitle': 'Method',
            'body': '{email:"test@test.com"}',
            'bodyTitle': 'Body'
          }
        },

        {
          "parentRuleId": 0,
          "workflowRuleId": 16,
          "ruleName": "Whatsapp",
          "id": 4,
          "active": false,
          "sortOrder": 0,
          "prop": {
            'mobileNumber': '009665272727',
            'message': 'Hi, this is demo message.',
            'mobileNumberTitle': 'Mobile Number',
            'messageTitle': 'Message',
          }
        },


        {
          "parentRuleId": 0,
          "workflowRuleId": 16,
          "ruleName": "SMS Notification",
          "id": 4,
          "active": false,
          "sortOrder": 0,
          "prop": {
            'mobileNumber': '009665272727',
            'message': 'Hi, this is demo sms.',
            'mobileNumberTitle': 'Mobile Number',
            'messageTitle': 'Message',
          }
        },

        {
          "parentRuleId": 0,
          "workflowRuleId": 16,
          "ruleName": "Create Task",
          "id": 4,
          "active": false,
          "sortOrder": 0,
          "prop": {
            'userId': '1',
            'userIdTitle': 'User',
          }
        },
      ];


      this.tasks.forEach(x => {
        this.tasklist.push(createTask(x));
      });




      //this.allsteps = [createStep("Step"), createRule("Rule"), createSwitchRule("s_rule")];
      this.reloadToolbox();
      //this.setForm();
      //this.form = JSON.parse(this.formContent.formData);
    });

  }

  loadData() {




    var tempData =
      [
        {
          "id": "asda",
          "enabled": true,
          "errorMessage": "asda",
          "expression": "asdas= ssdsd",
          "operator": "0",
          "rule": [
            {
              "id": "werwerewr",
              "enabled": true,
              "errorMessage": "werwerewr",
              "expression": "raererwr",
              "operator": "0",
              "rule": []
            }
          ]
        },
        {
          "id": "tretertert",
          "enabled": true,
          "errorMessage": "tretertert",
          "expression": "test",
          "operator": "0",
          "rule": [
            {
              "id": "sdssdfsdfsd",
              "enabled": true,
              "errorMessage": "sdssdfsdfsd",
              "expression": "test == 2323",
              "operator": "1",
              "success_event": "sdfsdfsdf",
              "workflow_rule_id": 0,
              "rule": [
                {
                  "id": "asda",
                  "enabled": true,
                  "errorMessage": "asda",
                  "expression": "asdas= ssdsd",
                  "operator": "0",
                  "success_event": "ads",
                  "workflow_rule_id": 0,
                  "rule": []
                }
              ]
            }
          ]
        },
        {
          "id": "sdssdfsdfsd",
          "enabled": true,
          "errorMessage": "sdssdfsdfsd",
          "expression": "test == 2323",
          "operator": "1",
          "rule": []
        }
      ];





    console.log("previous data", tempData)

    let respMessage = this.getChildRule(tempData)
    console.log("after formating", respMessage);

    // this.steps.push(createRule(x));

    this.workflowService.getRules(this.id).subscribe(results => {
      this.rules = results;
      this.steps = [];
      this.rules.forEach(x => {
        //   this.steps.push(createRule(x));
      });

      this.steps = respMessage;

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

  appendChildRule(arr) {
    let temp = {}
    var resp = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.sequence?.length > 0) {

        temp = {
          'id': arr[i].properties.errorMessage,
          'enabled': arr[i].properties.enabled,
          'errorMessage': arr[i].properties.errorMessage,
          'expression': arr[i].properties.expression,
          'operator': arr[i].properties.operator,
          'success_event': arr[i].properties.success_event,
          'workflow_rule_id': arr[i].properties.workflow_rule_id,
          'rule': this.appendChildRule(arr[i].sequence)
        }
      } else {
        temp = {
          'id': arr[i].properties.errorMessage,
          'enabled': arr[i].properties.enabled,
          'errorMessage': arr[i].properties.errorMessage,
          'expression': arr[i].properties.expression,
          'operator': arr[i].properties.operator,
          'success_event': arr[i].properties.success_event,
          'workflow_rule_id': arr[i].properties.workflow_rule_id,
          'rule': []
        }
      }
      resp.push(temp);
    }

    return resp;
  }




  getChildRule(arr) {

    let temp = {}
    var resp = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].rule.length > 0) {

        temp = {
          'componentType': 'container',
          'id': Uid.next(),
          'type': 'rule',
          'name': 'test rule name',
          'properties': {
            'id': arr[i].id,
            'workflow_rule_id': arr[i].workflowRuleId,
            'operator': arr[i].operator,
            'errorMessage': arr[i].errorMessage,
            'success_event': arr[i].successEvent,
            'expression': arr[i].expression,
            'enabled': arr[i].enabled,
            'velocity': 1,
          },
          'sequence': this.getChildRule(arr[i].rule)
        }

      } else {
        temp = {
          'componentType': 'container',
          'id': Uid.next(),
          'type': 'rule',
          'name': 'test rule name',
          'properties': {
            'id': arr[i].id,
            'workflow_rule_id': arr[i].workflowRuleId,
            'operator': arr[i].operator,
            'errorMessage': arr[i].errorMessage,
            'success_event': arr[i].successEvent,
            'expression': arr[i].expression,
            'enabled': arr[i].enabled,
            'velocity': 1,
          },
          'sequence': []
        }
      }
      resp.push(temp);
    }

    return resp;
  }




  SaveRule() {


    //appendChildRule

    // console.log("this.definition",this.response);
    let resp: any;
    resp = this.appendChildRule(this.response.sequence);
    console.log("resp", resp);
    console.log("Save Rule Trigerred");
  }










}
