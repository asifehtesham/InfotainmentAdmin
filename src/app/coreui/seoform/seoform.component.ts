import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { SEO } from 'src/app/models/SEO';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { SEOService } from 'src/app/services/seo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-seoform',
  templateUrl: './seoform.component.html',
  styleUrls: ['./seoform.component.scss']
})
export class SeoformComponent {
  @Input() ReferenceEntityID: any;
  @Input() ReferenceColumn: any;
  @Input() ReferenceTable: any;

  @Input() seoList: Array<SEO>;
  @Output() complete = new EventEmitter<Array<SEO>>();


  constructor(private fb: FormBuilder, private seoService: SEOService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    //request ? this.id = request.id : null


  }


  ngOnInit() {
    this.seoService.loadData().subscribe(result => {
      this.seoList = result

      result.forEach(seoRecord => {
        const seoForm = this.fb.group({
          title: [seoRecord.MetaName, Validators.required],
          content: [seoRecord.MetaContent, Validators.required]
        });
        this.seoArray.push(seoForm);
      });
    });
  }

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

  editLink(seo: SEO) {
    console.log(seo)
    // this.serviceLinks = serviceLinks
    // this.value = "Update"
    // this.myControl.setValue(this.serviceLinks.link)
    // this.f.serviceLinkTitle.setValue(this.serviceLinks.title)
  }
  deleteLink(seo: SEO) {
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
        this.seoService.delete(seo.id).subscribe(params => {

          console.log(params);
          //if (params)
          //this.load(serviceLinks.serviceId);
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



  form = this.fb.group({
    //... other form controls ...
    seoArray: this.fb.array([])
  });

  get seoArray() {
    return this.form.controls["seoArray"] as FormArray;
  }

  addSEO() {
    const seoForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.seoArray.push(seoForm);
  }

  deleteSEO(lessonIndex: number) {
    this.seoArray.removeAt(lessonIndex);
  }
}
