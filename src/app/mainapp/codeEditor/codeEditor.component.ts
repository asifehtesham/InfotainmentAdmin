import { Component, ViewChild, ElementRef, Inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { SingleFileUploadComponent } from "src/app/coreui/single-file-upload/single-file-upload.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { Observable } from "rxjs";

import { Page } from "src/app/models/Page";
import { PageContent } from "src/app/models/PageContent";

import { EditorConfig } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

import { PagesService } from "src/app/services/pages.service";

import { TemplatesService } from "src/app/services/templates.service";

import * as ace from "ace-builds";

@Component({
  selector: "app-pagedetail",
  templateUrl: "./codeEditor.component.html",
  styleUrls: ["./codeEditor.component.scss"],
})
export class codeEditor {
  @ViewChild("editor") private aceEditor: ElementRef<HTMLElement>;

  content: any;
  title: any;
  type: any;
  id: number;
  page: Page;
  pageForm: FormGroup;

  isPageSaved: boolean = true;

  pageTemplate: SelectModel[];

  //Parentpage: Page[];
  @ViewChild("imagefile", { static: true }) imagefile: ElementRef;
  @ViewChild("imageControl", { static: false })
  imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = ["Apple", "Lemon", "Lime", "Orange", "Strawberry"];
  todo: any = [];
  data: Page;
  temp = true;

  @ViewChild("tagInput", { static: false })
  tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip





  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pageService: PagesService,
    private templatesService: TemplatesService,
    private snakbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any,
    private dialogRef: MatDialogRef<codeEditor>
  ) {
    //      this.id = (request?.pageId)?request.pageId:0;

    if (request?.content) {
      this.content = request.content;
    }
    if (request?.title) {
      this.title = request.title;
    }
    if (request?.type) {
      this.type = request.type;
    }
  }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
    );
    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    if (this.content) {
      aceEditor.session.setValue(this.content);
    }

    if (this.type == "customCss") {
      aceEditor.session.setMode("ace/mode/css");
    } else if (this.type == "customJs") {
      aceEditor.session.setMode("ace/mode/javascript");
    } else if (this.type == "customCdn") {
      aceEditor.session.setMode("ace/mode/html");
    } else {
      aceEditor.session.setMode("ace/mode/html");
    }
    aceEditor.setTheme("ace/theme/tomorrow_night");
  }

  //customCss
  //customJs
  //customCdn
  ngOnInit() { }

  save() {
    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    this.dialogRef.close({ content: aceEditor.session.getValue() })
  }
}
