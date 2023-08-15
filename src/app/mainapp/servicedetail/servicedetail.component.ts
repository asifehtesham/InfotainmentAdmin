import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { SectionAddComponent } from 'src/app/admin/Courses/sectionadd/section-add.component';
import { Service } from 'src/app/models/Service';
import { ServiceLinks } from 'src/app/models/ServiceLinks';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';
import { SiteLinksService } from 'src/app/services/site_links.service';



@Component({
  selector: 'app-servicedetail',
  templateUrl: './servicedetail.component.html',
  styleUrls: ['./servicedetail.component.scss']
})
export class ServicedetailComponent {

  id: number;
  service: Service;
  serviceForm: FormGroup;
  ImageTitle: string = "";
  ImagePath: string = "";
  sortId: number = 1;
  sortLinks: any = []
  serviceLinks: ServiceLinks;

  linkSuggestions: [{ link: 'test.com', title: 'test.com title' }, { link: 'test1.com', title: 'test1.com title' }, { link: 'test2.com', title: 'test2.com title' }];




  myControl: FormControl = new FormControl();
  options: any;
  filteredOptions: Observable<string[]>;


  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private serviceService: ServiceService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private siteLinksService: SiteLinksService,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    request ? this.id = request.id : null
  }


  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

async  ngOnInit() {

  await this.siteLinksService.get_links().subscribe(results => {
      let opt = [];
      if (results.data.length > 0) {
        for (let index = 0; index < results.data.length; index++) {
          opt.push(results.data[index].url);
        }
        this.options = opt;
      }
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );


    this.route.params.subscribe(params => {

      this.buildForm();

      if (this.id > 0) {
        this.serviceService.loadByID(this.id).subscribe(results => {

          console.log("results...+++..", results)
          this.service = results;
          this.f.title.setValue(this.service.title);
          this.f.content.setValue(this.service.content);
          this.f.availableStartDate.setValue(this.service.availableStartDate);
          this.f.availableEndDate.setValue(this.service.availableEndDate);
          this.f.isPublish.setValue(this.service.isPublish);

          if (this.service.image) {
            this.imageControl.setImage(this.service.image.data);
          }
          if (this.service.links.length > 0) {
            this.sortId = this.service.links.length + 1;
            this.sortLinks = this.service.links;
          }
        });
      }
    });
  }
  buildForm() {
    console.log("build form ");
    this.serviceForm = this.fb.group({
      'ID': [this.id, [
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'content': ['', []],
      'availableStartDate': new FormControl((new Date()).toISOString().substring(0, 10)),
      'availableEndDate': ['', [Validators.required]],
      'isPublish': ['', []],
      'serviceLinkTitle': [],
      'serviceLinks': [],
      'links': []
    });

  }
  get f() { return this.serviceForm.controls; }
  save() {
    console.log('save call');
    this.saveData();
  }
  saveData() {
    var service: Service = {
      id: this.id,
      title: this.f.title.value,
      content: this.f.content.value,
      availableStartDate: this.f.availableStartDate.value,
      availableEndDate: this.f.availableEndDate.value,
      isPublish: this.f.isPublish.value == null ? false : true,
      links: null
    }
    var observer: Observable<any>;
    if (service.id == null || service.id <= 0)
      observer = this.serviceService.add(service);
    else
      observer = this.serviceService.edit(service);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log("result", result);
      this.id = result.id;

      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Services", false, false);

      if (result.id)
        this.snakbar.open('Service created successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });
  }
  revert() {
    this.serviceForm.reset();
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
  addLink(title, link) {


    if (link && title) {
      var newLink: ServiceLinks = {
        serviceId: this.id,
        title: title,
        link: link,
        sortId: this.sortId,
      }
      this.serviceService.addLink(newLink).subscribe(results => {
        this.sortLinks.push(results)
        this.sortId = this.sortId + 1;
        console.log(this.sortLinks)
        this.value = "Add"
        this.snakbar.open('Link created successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    }
    else {
      this.snakbar.open('Link Field Should not be Null.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
  updateLink(title, link) {
    if (link && title) {
      var updateLink: ServiceLinks = {
        serviceId: this.serviceLinks.serviceId,
        title: title,
        link: link,
        sortId: this.serviceLinks.sortId,
        id: this.serviceLinks.id
      }
      this.serviceService.updateLink(updateLink).subscribe(results => {
        this.loadLinks(this.id)
        this.value = "Add"
        this.snakbar.open('Link Updated successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    }
    else {
      this.snakbar.open('Link Field Should not be Null.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortLinks, event.previousIndex, event.currentIndex);

    this.sortLinks.forEach((element, index) => {
      element.sortId = index + 1;
    })
    console.log(this.sortLinks)
    this.serviceService.movedLink(this.sortLinks).subscribe(result => {
      if (result)
        this.snakbar.open('Link moved Successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    })
  }
  loadLinks(serviceId: number) {
    console.log(serviceId)
    this.serviceService.loadLinks(serviceId).subscribe(results => {
      console.log("res", results)
      this.sortLinks = results;
    })
  }
  value = "Add"
  editLink(serviceLinks: ServiceLinks) {
    console.log(serviceLinks)
    this.serviceLinks = serviceLinks
    this.value = "Update"
    this.myControl.setValue(this.serviceLinks.link)
    this.f.serviceLinkTitle.setValue(this.serviceLinks.title)
  }
  deleteLink(serviceLinks: ServiceLinks) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService.deleteLink(serviceLinks).subscribe(params => {

          console.log(params);
          if (params)
            this.loadLinks(serviceLinks.serviceId);
        });

      }
      else {
        Swal.fire(
          'Cancelled',
          'Your Service Link is safe :)',
          'error'
        )
      }
    })

  }
}

