import { Component, OnInit, ViewChild, ElementRef, Input, Inject, AfterViewInit } from '@angular/core';
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
import { Banner } from 'src/app/models/Banner';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BannerService } from 'src/app/services/banner.service';

@Component({
  selector: 'app-bannerdetail',
  templateUrl: './bannerdetail.component.html',
  styleUrls: ['./bannerdetail.component.scss']
})
export class BannerdetailComponent implements OnInit, AfterViewInit {

  id: number;
  banner: Banner;
  bannerForm: FormGroup;

  url: string = '';
  done: any;
  isBannerSaved: boolean = true;

  bannerTemplate: SelectModel[] = [
    { id: '0', viewValue: 'Empty' },
    { id: '1', viewValue: 'Template 1' },
    { id: '2', viewValue: 'Template 2' }
  ];

  //Parentbanner: Banner[];
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  todo: any = [];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private bannerService: BannerService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    if (request) {
      this.id = request.id;
      this.banner = request.banner;
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  ngOnInit() {
    // this.questionService.loadData().subscribe(results => {
    //   //this.loadEmptyMsg = true;
    //   console.log('come to the subscriber');
    //   this.availableQuestions = results;
    // });

    this.route.params.subscribe(params => {

      //this.id = params['id'];
      //this.id = 0;
      console.log("bannerID para:" + this.id);

      this.buildForm();

      if (this.banner != null)
        this.setForm();
      if (this.banner == null && this.id > 0) {
        this.bannerService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.banner = results;
          this.setForm();

        });

        //this.loadBannerQuestion();
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.banner.image != null)
      this.imageControl.setImage(this.banner.image.data);
  }

  setForm() {
    this.f.Link.setValue(this.banner.link);
    this.f.LinkText.setValue(this.banner.linkText);
    this.f.Title.setValue(this.banner.title);
    //this.f.CurrentVersion.setValue(this.banner.currentVersion);
    this.f.Content.setValue(this.banner.content);
    this.f.AvailableStartDate.setValue(this.banner.availableStartDate);
    this.f.AvailableEndDate.setValue(this.banner.availableEndDate);
    //this.f.isPublish.setValue(this.banner.isPublish);
    //this.f.IsActive.setValue(this.banner.IsActive);


  }
  // loadBannerQuestion() {
  //   this.questionService.getBannerQuestions(this.bannerID).subscribe(results => {
  //     //this.loadEmptyMsg = true;
  //     console.log('come to the subscriber');
  //     this.selectedQuestions = results;
  //   });
  // }

  buildForm() {
    console.log("build form ");
    this.bannerForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'Link': ['', [
        Validators.maxLength(5000)
      ]],
      'LinkText': ['', [
        Validators.maxLength(50)
      ]],
      'Title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'Content': ['', []],
      'AvailableStartDate': ['', []],
      'AvailableEndDate': ['', []],
      'isFeatured': ['', []]
    });

  }

  get f() { return this.bannerForm.controls; }

  save() {
    console.log('save call');


    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var banner: Banner = {

      id: this.id,
      title: this.f.Title.value,
      link: this.f.Link.value,
      linkText: this.f.LinkText.value,
      content: this.f.Content.value,
      availableStartDate: this.f.AvailableStartDate.value,
      availableEndDate: this.f.AvailableEndDate.value,

      isPublish: false,
      //isPublish: this.f.isPublish.value,
      //IsActive: this.f.IsActive.value,

    }
    var observer: Observable<any>;
    if (banner.id == null || banner.id <= 0)
      observer = this.bannerService.add(banner);
    else
      observer = this.bannerService.edit(banner);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result);
      console.log(result.id);
      this.id = result.id;

      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Banner", false, false);

      // if (this.id > 0)
      //   this.loadBannerQuestion();
    });
  }

  revert() {
    this.bannerForm.reset();
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
        const extension = file.name.split('.')[1].toLowerCase();
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
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
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
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }
  //#endregion Chip.


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  topics_selectionChange(question) { }

}

