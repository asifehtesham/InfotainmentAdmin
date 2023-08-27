import { Inject, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import grapesjs from "grapesjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ContentbuilderComponent } from '../content-builder/content-builder.component';





@Component({
  selector: "app-text-component",
  templateUrl: "./text-component.component.html",
  styleUrls: ["./text-component.component.scss"],
})
export class TextComponent implements OnInit {
  $: any;
  pageContentModel: any;
  result: any;
  pageContent: any;
  customComponents: any;
  editorConfig: any = EditorConfig;
  contentForm = new FormGroup({
    content: new FormControl('<p> testing 2.... </p>'),
  });

  @ViewChild("gjs", { static: false }) editor: grapesjs.Editor;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public request: any,
    private dialogRef: MatDialogRef<TextComponent>
  ) {




  }


  @Input() contentData: any;
  @Input() components: any;
  @Output() contentDataChange: EventEmitter<any> = new EventEmitter<any>();



  async ngOnInit() {

    console.log("this.contentData ........",this.contentData)

    this.contentForm.controls.content.setValue(this.contentData);
  }

  onAdvanceEdit() {




    const dialogRef = this.dialog.open(ContentbuilderComponent, {
      width: '100%',
      height: '100%',
      data: {
        content: this.contentForm.controls.content.value,
        custom_components:this.components
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        //this.blog.content = result.content;
        //this.f.content.setValue(result.content);
        this.contentData = 'new updated content'; //result.content;
        this.contentForm.controls.content.setValue(result.content);
        this.update();
      }
    });
  }

  update() {
    
    let data = this.contentForm.controls.content.value;
    this.contentDataChange.emit(data);
  }




}
