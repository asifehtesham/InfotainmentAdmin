import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, empty, map } from 'rxjs';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { Attachment } from 'src/app/models/Attachment';
import { AttachmentsService } from 'src/app/services/attachments.service';
import { GalleryService } from 'src/app/services/gallery.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallery-media',
  templateUrl: './gallery-media.component.html',
  styleUrls: ['./gallery-media.component.scss']
})
export class GalleryMediaComponent {

  id: number;
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;
  ImageTitle: string = "";
  ImagePath: string = "";
  //images: Attachment[];
  images: Observable<Attachment[]>
  constructor(private route: ActivatedRoute, private snakbar: MatSnackBar,
    private attachmentsService: AttachmentsService,
    private galleryService: GalleryService) {
    console.log("request");
    //console.log(request);
    //this.id = request.id;
    // if (request) {
    //   this.id = request.id;
    // }
  }

  ngOnInit() {

    this.id = this.route.snapshot.params.type;
    console.log("Gallery ID ", this.id);

    /*this.route.snapshot.params.subscribe(params => {
      console.log("comes in subscriber:", params);
      this.id = params['id'];
      //this.id = 0;
      console.log("newsID para:" + this.id);

      if (this.id > 0) {
        this.attachmentsService.getByReference(this.id, "Gallery", "ID").subscribe(results => {
          console.log(results);
        });
      }
    });
    */
  }

  loadData() {
    // this.images = this.attachmentsService.getByReference(this.id, "Gallery", "ID").subscribe(results => {
    //   console.log("Image result", results);
    //   this.images = results;
    // });

    this.images = this.attachmentsService.getByReference(this.id, "Gallery", "ID");
    // .pipe(
    //   map((results => {
    //     console.log("getAccouncements comp: ");
    //     console.log(results);
    //     return results;
    //   })),
    //   catchError((error) => {
    //     return empty();
    //   })
    // );
  }
  ngAfterViewInit(): void {
    // if (this.news.image != null)
    //   this.imageControl.setImage(this.news.image.data);

    this.loadData();
  }


  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data); // We just print out data bubbled up from event emitter.

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;



    this.loadData();
    //this.saveData();
  }

  uploadFile() {
    if (this.imageControl.file)
      this.imageControl.startUpload(this.id, "ID", "Gallery", true, false);

  }
  onUpload() { }



  onRemove(image: any) {
    console.log("image to delete", image);
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
        this.attachmentsService.delete(image.id).subscribe(
          result => {
            this.snakbar.open('Image deleted.', 'Ok', {
              duration: 2000,
            });

            this.loadData();
          }
        );
      }
      else {
        this.snakbar.open('Delete action dismissed.', 'Ok', {
          duration: 2000,
        });
      }
    })

  }
}
