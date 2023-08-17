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
import { News } from 'src/app/models/News';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';


import { CountryService } from 'src/app/services/country.service';


@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.component.html',
  styleUrls: ['./newsdetail.component.scss']
})
export class NewsdetailComponent {
  templates: Templates[] = [];
  id: number;
  news: News;
  newsForm: FormGroup;

  url: string = '';
  done: any;
  isNewsSaved: boolean = true;

  newsTemplate: SelectModel[] = [
    { id: '0', viewValue: 'Empty' },
    { id: '1', viewValue: 'Template 1' },
    { id: '2', viewValue: 'Template 2' }
  ];

  //Parentnews: News[];
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



  countries: SelectModel[];



  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private route: ActivatedRoute,
    private countryService: CountryService,
    private fb: FormBuilder, private newsService: NewsService, private snakbar: MatSnackBar, private dialog: MatDialog, private templatesService: TemplatesService,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.news = request.news;
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


    var temp = [];
    this.countryService.loadData().subscribe((results) => {
      temp.push({ id: 0, title: "No Country" });
      results.forEach((element) => {
        temp.push({ id: element.id, title: element.name });
      });
    });
    this.countries = temp;


    this.templatesService.loadData().subscribe(results => {
      results.forEach(element => {
        this.templates.push(element)
      });
    });

    this.route.params.subscribe(params => {
      //this.id = params['id'];
      //this.id = 0;
      console.log("newsID para:" + this.id);

      this.buildForm();

      if (this.news != null)
        this.setForm();
      if (this.news == null && this.id > 0) {
        this.newsService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.news = results;
          this.setForm();
          //this.f.isPublish.setValue(this.news.isPublish);
          //this.f.IsActive.setValue(this.news.IsActive);

        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.news.image != null)
      this.imageControl.setImage(this.news.image.data);
  }

  setForm() {
    this.f.slug.setValue(this.news.slug);
    this.f.title.setValue(this.news.title);
    this.f.content.setValue(this.news.content);
    this.f.availableStartDate.setValue(this.news.availableStartDate);
    this.f.availableEndDate.setValue(this.news.availableEndDate);
    this.f.isFeatured.setValue(this.news.isFeatured);
    this.f.templateSlug.setValue(this.news.templateSlug);
  }
  // loadNewsQuestion() {
  //   this.questionService.getNewsQuestions(this.newsID).subscribe(results => {
  //     //this.loadEmptyMsg = true;
  //     console.log('come to the subscriber');
  //     this.selectedQuestions = results;
  //   });
  // }

  buildForm() {
    this.newsForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'slug': ['', [
        Validators.maxLength(5000)
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'content': ['', []],
      'availableStartDate': ['', []],
      'availableEndDate': ['', []],
      'isFeatured': ['', []],
      'templateSlug': []
    });

  }

  get f() { return this.newsForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var news: News = {
      id: this.id,
      title: this.f.title.value,
      slug: this.f.slug.value,
      content: this.f.content.value,
      availableStartDate: this.f.availableStartDate.value,
      availableEndDate: this.f.availableEndDate.value,
      isFeatured: (this.f.isFeatured.value == true) ? true : false,
      isPublish: false,
      templateSlug: this.f.templateSlug.value,
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (news.id == null || news.id <= 0)
      observer = this.newsService.add(news);
    else
      observer = this.newsService.update(news);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "News", false, false);

      if (result.id)
        this.snakbar.open('News saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.newsForm.reset();
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



  update(data) {
    this.f.content.setValue(data);
  }


}

