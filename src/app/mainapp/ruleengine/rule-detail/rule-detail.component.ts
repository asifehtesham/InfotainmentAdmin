import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Rule } from 'src/app/models/ruleengine/Rule';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { RuleService } from 'src/app/services/ruleengine/rules.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.component.html',
  styleUrls: ['./rule-detail.component.scss']
})
export class RuleDetailComponent {

  templates: Templates[] = [];
  id: number;
  rule: Rule;
  ruleForm: FormGroup;

  url: string = '';
  done: any;
  isRuleSaved: boolean = true;

  Operators: SelectModel[] = [
    { id: '0', viewValue: 'And' },
    { id: '1', viewValue: 'Or' }
  ];


  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private ruleService: RuleService, private snakbar: MatSnackBar,
    private branchService: BranchService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.rule = request.rule;
    }
  }

  ngOnInit() {


    this.route.params.subscribe(params => {
      console.log("ruleID para:" + this.id);

      this.buildForm();

      if (this.rule != null)
        this.setForm();
      if (this.rule == null && this.id > 0) {
        this.ruleService.loadByID(this.id).subscribe(results => {
          this.rule = results;
          this.setForm();
        });
      }
    });
  }


  setForm() {

    this.f.ruleName.setValue(this.rule.ruleName);
    this.f.expression.setValue(this.rule.expression);
    this.f.operator.setValue(this.rule.operator);
    this.f.errorMessage.setValue(this.rule.errorMessage);
    this.f.successEvent.setValue(this.rule.successEvent);
    this.f.enabled.setValue(this.rule.enabled);




  }

  buildForm() {
    this.ruleForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'ruleName': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'expression': ['', [
        Validators.maxLength(500),
      ]],
      'operator': ['', []],
      'errorMessage': ['', []],
      'successEvent': ['', []],
      'enabled': [true, []],
    });

  }

  get f() { return this.ruleForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var rule: Rule = {
      id: this.id,
      ruleName: this.f.ruleName.value,
      expression: this.f.expression.value,
      operator: this.f.operator.value,
      errorMessage: this.f.errorMessage.value,
      successEvent: this.f.successEvent.value,
      enabled: this.f.enabled.value,
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (rule.id == null || rule.id <= 0)
      observer = this.ruleService.add(rule);
    else
      observer = this.ruleService.update(rule);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Rule", false, false);

      if (result.id)
        this.snakbar.open('Rule saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.ruleForm.reset();
  }

  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data); // We just print out data bubbled up from event emitter.

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
    //this.saveData();
  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.title.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }
      return null;
    };
  }
}

