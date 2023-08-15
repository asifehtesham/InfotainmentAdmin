import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { SingleFileUploadComponent } from "src/app/coreui/single-file-upload/single-file-upload.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Page } from "src/app/models/Page";
import { PageContent } from "src/app/models/PageContent";

import { EditorConfig } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

import { PagesService } from "src/app/services/pages.service";
import { TemplatesService } from "src/app/services/templates.service";
import { ComponentService } from "src/app/services/components.service";

import { element } from "protractor";
import Swal from "sweetalert2";
import { Templates } from "src/app/models/Templates";
import { PageComponent } from "src/app/models/PageComponent";

@Component({
  selector: "app-pagedetail",
  templateUrl: "./componentdetail.component.html",
  styleUrls: ["./componentdetail.component.scss"],
})
export class componentDetail {
  id: number;
  page: Page;
  pageForm: FormGroup;

  url: string = "";
  done: any;
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
  data: PageComponent;
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
    private componentService: ComponentService,
    private snakbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any
  ) {
    //      this.id = (request?.pageId)?request.pageId:0;

    if (request?.data) {
      this.data = request.data;
    }
  }
  ngOnInit() {
    console.log("this.data+++++", this.data);

    // this.questionService.loadData().subscribe(results => {
    //   //this.loadEmptyMsg = true;
    //   console.log('come to the subscriber');
    //   this.availableQuestions = results;
    // });

    // this.route.params.subscribe(params => {

    // });

    // console.log("params",params);
    // this.id = params['id'];
    // console.log("pageid para:" + this.id);

    // var temp = [];
    // this.templatesService.loadData().subscribe((results) => {
    //   temp.push({ value: 0, viewValue: "Empty Template" });
    //   results.forEach((element) => {
    //     temp.push({ value: element.id, viewValue: element.title });
    //   });
    // });
    // this.pageTemplate = temp;

    // this.temp = true;

    this.buildForm();

    console.log("this.data",this.data);
    if (this.data) {
      this.temp = false;
      this.f.slug.setValue(this.data.slug);
      this.f.title.setValue(this.data.title);

      // this.pageService.loadByID(this.data.id).subscribe(results => {

      //   console.log("results",results);
      // });
    }
  }

  buildForm() {
    console.log("build form ");
    this.pageForm = this.fb.group({
      id: [
        this.id,
        [
          //Validators.required
        ],
      ],
      slug: ["", [Validators.maxLength(5000)]],
      title: [
        "",
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(1),
        ],
      ],
      Template: [
        "",
        [
          //Validators.maxLength(500)
        ],
      ],
      // 'isPublish': ['', [

      // ]],
    });
  }

  get f() {
    return this.pageForm.controls;
  }

  save() {
    console.log("save call");

    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {
    if (this.data) {

      
      this.data.title = this.f.title.value;
      this.data.slug = this.f.slug.value;
      this.componentService.update(this.data).subscribe((result) => {
        console.log("result----------", result);

        if (result) {
          // Swal.fire({
          //   title: "Congractulations!",
          //   text: "Your page has been updated successfully.",
          //   icon: "success",
          // });

          this.snakbar.open('Congractulations! Your page has been updated successfully.', 'Ok', {
            duration: 2000,
          });
        


          

          //   return this.router.navigate(["/mainapp/design/page", result.id]);
        } else {
          alert("Sorry, we are unable to update your page");
        }
      });
    } else {
      var temp: PageComponent = {
        id: 0,
        title: this.f.title.value,
        slug: this.f.slug.value,
        html:'',
        css:'',
        cdnLinks:'',
        customCSS:'',
        customJS:'',
        pageData:''
      };

      this.componentService.add(temp).subscribe((result) => {

        if (result.id) {
          // Swal.fire({
          //   title: "Congractulations!",
          //   text: "Your page has been created successfully.",
          //   icon: "success",
          // });


          this.snakbar.open('Congractulations! Your page has been created successfully.', 'Ok', {
            duration: 2000,
          });
        

          
            return this.router.navigate([`/mainapp/design/component/${result.id}`]);
        } else {
          
          alert("Sorry, we are unable to add your page");
        }
      });
    }
  }

  revert() {
    this.pageForm.reset();
  }

  onFileComplete(data: any) {
    this.snakbar.open("Image uploaded successfully.", null, {
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
        const extension = file.name.split(".")[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true,
          };
        }

        return null;
      }
      return null;
    };
  }

  onAdd() {
    // const dialogRef = this.dialog.open(SectionAddComponent, {
    //   width: '650px',
    //   data: 0
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  //#region Chip
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || "").trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }
  //#endregion Chip.

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  topics_selectionChange(question) {}
}
