import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  ValidatorConfiguration
} from 'sequential-workflow-designer';

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

function createDefinition(): Definition {
  return {
    properties: {
      velocity: 0
    },
    sequence: [createStep('Step 1'), createStep('Step 2'), createStep('Step 3')]
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

  private designer?: Designer;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;
  public isValid?: boolean;


  public readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      {
        name: 'Step',
        steps: [createStep("Step")]
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
    console.log('definition has changed');
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
    this.definition = createDefinition();
    this.updateDefinitionJSON();
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
  }
}
