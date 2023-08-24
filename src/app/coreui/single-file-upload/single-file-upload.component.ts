import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.scss']
})
export class SingleFileUploadComponent implements OnInit {

  constructor(private _http: HttpClient) { }

  private files: Array<SingleFileUploadModel> = [];
  public file: File;
  public progress: number;
  imgURL: any;

  ReferenceEntityID: any;
  ReferenceColumn: any;
  ReferenceTable: any;
  AllowMultiple: any=false;
  folderOnly: any = false;

  @Input() text = 'Upload';
  @Input() param = 'file';
  @Input() target = environment.infotApiUrl;
  @Input() action = 'attachment';
  @Input() accept = 'image/*';
  @Output() complete = new EventEmitter<string>();

  ngOnInit() {
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.file = file;

        var mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          //this.message = "Only images are supported.";
          return;
        }

        var reader = new FileReader();
        //this.imagePath = files;
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.imgURL = reader.result;
        }
        // this.files.push({ data: file, state: 'in', 
        //   inProgress: false, progress: 0, canRetry: false, canCancel: true });
      }
      //this.uploadFiles();
    };
    fileUpload.click();
  }

  public setImage(image: any) {

    this.imgURL = "data:image/png;base64," + image;
  }

  public startUpload(p_ReferenceEntityID: number, p_ReferenceColumn: String, p_ReferenceTable: String, p_AllowMultiple: boolean, p_folderOnly: boolean) {

    console.log(this.action);

    this.ReferenceEntityID = p_ReferenceEntityID;
    this.ReferenceColumn = p_ReferenceColumn
    this.ReferenceTable = p_ReferenceTable;
    this.AllowMultiple = p_AllowMultiple;
    this.folderOnly = (p_folderOnly === undefined) ? false : p_folderOnly;

    console.log("p_folderOnly");
    console.log(p_folderOnly);
    console.log(this.folderOnly);

    console.log('startUpload');
    this.uploadFile(this.file);
  }
  public uploadFile1(fileUpload: any) {
    console.log("uploadFile1");
    console.log(fileUpload);
    for (let index = 0; index < fileUpload.length; index++) {
      const file = fileUpload[index];
      this.file = file;

      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        //this.message = "Only images are supported.";
        return;
      }

      var reader = new FileReader();
      //this.imagePath = files;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      // this.files.push({ data: file, state: 'in', 
      //   inProgress: false, progress: 0, canRetry: false, canCancel: true });
    }
  }

  private uploadFile(file: File) {
    console.log('uploadFile');
    const fd = new FormData();
    fd.append(this.param, file);

    console.log("folderOnly");
    console.log(this.folderOnly);

    fd.append("ReferenceTable", this.ReferenceTable);
    fd.append("ReferenceColumn", this.ReferenceColumn);
    fd.append("ReferenceEntityID", this.ReferenceEntityID);
    fd.append("folderOnly", this.folderOnly);

    fd.append("AllowMultiple", this.AllowMultiple);

    const req = new HttpRequest('POST', this.target + this.action, fd, {
      reportProgress: true
    });

    this._http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => { }),
      last(),
      catchError((error: HttpErrorResponse) => {

        return of(`${file.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        console.log(event);
        if (typeof (event) === 'object') {
          //this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

}


export class SingleFileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}