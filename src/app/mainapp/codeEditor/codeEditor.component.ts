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

import * as ace from "ace-builds";
import * as beautify from "ace-builds/src-noconflict/ext-beautify";



var beautify_js = require('js-beautify'); // also available under "js" export

var beautify_css = require('js-beautify').css;

var beautify_html = require('js-beautify').html;

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';



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
  customJs: string;
  customCss: string;
  cdnLinks: string;
  html: string;

  isContent: Boolean = false;
  iscustomCss: Boolean = false;
  iscustomJs: Boolean = false;
  iscdnLinks: Boolean = false;


  @ViewChild("tagInput", { static: false })
  tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;



  constructor(
    @Inject(MAT_DIALOG_DATA) public request: any,
    private dialogRef: MatDialogRef<codeEditor>
  ) {
    //      this.id = (request?.pageId)?request.pageId:0;

    if (request?.content) {
      this.content = request.content;
    }


    if (request?.customJs) {
      this.customJs = request.customJs;
    }

    if (request?.customCss) {
      this.customCss = request.customCss;
    }

    if (request?.cdnLinks) {
      this.cdnLinks = request.cdnLinks;
    }


    if (request?.title) {
      this.title = request.title;
    }
    if (request?.type) {
      this.type = request.type;
    }
  }

  ngAfterViewInit(): void {
    ace.config.set("wrap", true);
    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
    );
    const aceEditor = ace.edit(this.aceEditor.nativeElement);





    aceEditor.commands.addCommand({
      name: 'myCommand',
      bindKey: {win: 'Ctrl-M',  mac: 'Command-M'},
      exec: function(editor) {
          alert(2);
      },
      readOnly: true, // false if this command should not apply in readOnly mode
      // multiSelectAction: "forEach", optional way to control behavior with multiple cursors
      // scrollIntoView: "cursor", control how cursor is scolled into view after the command
  });

    // aceEditor.setOptions({
    //   autoScrollEditorIntoView: true,
    //   copyWithEmptySelection: true,
    // });


    aceEditor.on("change", () => {

      let val = aceEditor.getValue();

      if (this.iscustomCss == true) {
        this.customCss = val;
      } else if (this.iscustomJs == true) {
        this.customJs = val;
      } else if (this.iscdnLinks == true) {
        this.cdnLinks = val;
      } else {
        this.content = val;
      }


    });

    if (this.content) {
      var html_beautyfy = beautify_html(this.content);
      aceEditor.session.setValue(html_beautyfy);
    }
    aceEditor.setTheme("ace/theme/tomorrow_night");
    // aceEditor.on("change", () => {

    //   if (this.isContent) {
    //     this.content = aceEditor.getValue();
    //   } else if (this.iscustomCss) {
    //     this.customCss = aceEditor.getValue();
    //   } else if (this.iscustomJs) {
    //     this.customJs = aceEditor.getValue();
    //   } else if (this.iscdnLinks) {
    //     this.cdnLinks = aceEditor.getValue();
    //   }
    // });
  }

  ngOnInit() { }

  save() {
    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    this.dialogRef.close({
      content: this.content,
      customCss: this.customCss,
      customJs: this.customJs,
      cdnLinks: this.cdnLinks
    })
  }

  triggerHtml() {
    this.isContent = true;
    this.iscustomCss = false;
    this.iscustomJs = false;
    this.iscdnLinks = false;

    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    var html_beautyfy = '';
    if (this.content) {
      html_beautyfy = beautify_html(this.content);
    }
    aceEditor.session.setValue(html_beautyfy);
    aceEditor.session.setMode("ace/mode/html");
    aceEditor.setTheme("ace/theme/tomorrow_night");
  }

  triggerCss() {
    this.isContent = false;
    this.iscustomJs = false;
    this.iscdnLinks = false;
    this.iscustomCss = true;

    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    var html_beautyfy = '';
    if (this.customCss) {
      html_beautyfy = beautify_html(this.customCss);
    }
    aceEditor.session.setValue(html_beautyfy);
    aceEditor.session.setMode("ace/mode/css");
    aceEditor.setTheme("ace/theme/tomorrow_night");

  }

  triggerJs() {
    this.isContent = false;
    this.iscustomCss = false;
    this.iscdnLinks = false;
    this.iscustomJs = true;

    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    var html_beautyfy = '';
    if (this.customJs) {
      html_beautyfy = beautify_html(this.customJs);
    }
    aceEditor.session.setValue(html_beautyfy);
    aceEditor.session.setMode("ace/mode/javascript");
    aceEditor.setTheme("ace/theme/tomorrow_night");
  }


  triggercdnLinks() {

    this.isContent = false;
    this.iscustomCss = false;
    this.iscustomJs = false;
    this.iscdnLinks = true;


    const aceEditor = ace.edit(this.aceEditor.nativeElement);
    var html_beautyfy = '';
    if (this.cdnLinks) {
      html_beautyfy = beautify_html(this.cdnLinks);
    }
    aceEditor.session.setValue(html_beautyfy);
    aceEditor.session.setMode("ace/mode/javascript");
    aceEditor.setTheme("ace/theme/tomorrow_night");
  }

  copyText() {
   let copyText = document.execCommand('copy');

       console.log("copyText...",copyText);

  }




  pasteText() {
    var pasteTarget = document.createElement("div");
    var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("Paste", null, null);
    var paste = pasteTarget.innerText;
    actElem.removeChild(pasteTarget);

    console.log("paste...", pasteTarget.innerText);
    return paste;
  };



}
