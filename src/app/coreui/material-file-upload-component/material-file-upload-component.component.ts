import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {
      HttpClient, HttpResponse, HttpRequest,
      HttpEventType, HttpErrorResponse
} from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConnectedPosition, Overlay, PositionStrategy, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
      selector: 'app-material-file-upload',
      templateUrl: './material-file-upload-component.component.html',
      styleUrls: ['./material-file-upload-component.component.scss'],
      animations: [
            trigger('fadeInOut', [
                  state('in', style({ opacity: 100 })),
                  transition('* => void', [
                        animate(300, style({ opacity: 0 }))
                  ])
            ])
      ]
})

export class MaterialFileUploadComponentComponent implements OnInit {

      @Input() ReferenceEntityID: any;
      @Input() ReferenceColumn: any;
      @Input() ReferenceTable: any;
      @Input() AllowMultiple: any = false;
      @Input() folderOnly: any = false;

      @Input() text = 'Upload';
      @Input() param = 'file';
      @Input() target = environment.apiUrl;
      @Input() action = 'attachment';
      @Input() accept = 'image/*';
      @Output() complete = new EventEmitter<string>();
      isOpen: boolean = false;
      public files: Array<FileUploadModel> = [];

      positions: ConnectedPosition[] = [{
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: 0,
            offsetY: 10
      }];

      positions1: PositionStrategy;
      scrollStrategy: ScrollStrategy;


      constructor(private _http: HttpClient, private scrollStrategies: ScrollStrategyOptions,
            private overlay: Overlay) {
            this.scrollStrategy = scrollStrategies.block();
      }

      ngOnInit() {
            //this.positions1 = this.overlay.position().global()
      }

      onClick() {
            this.files = [];
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.onchange = () => {
                  this.isOpen = true;
                  for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        this.files.push({
                              data: file, state: 'in',
                              inProgress: false, progress: 0, canRetry: false, canCancel: true
                        });
                  }
                  this.uploadFiles();
            };
            fileUpload.click();

      }

      cancelFile(file: FileUploadModel) {
            file.sub.unsubscribe();
            this.removeFileFromArray(file);
      }

      retryFile(file: FileUploadModel) {
            this.uploadFile(file);
            file.canRetry = false;
      }

      private uploadFile(file: FileUploadModel) {
            const fd = new FormData();
            fd.append(this.param, file.data);



            fd.append("ReferenceTable", this.ReferenceTable);
            fd.append("ReferenceColumn", this.ReferenceColumn);
            fd.append("ReferenceEntityID", this.ReferenceEntityID);
            fd.append("folderOnly", this.folderOnly);

            fd.append("AllowMultiple", this.AllowMultiple);
            const req = new HttpRequest('POST', this.target + this.action, fd, {
                  reportProgress: true
            });

            file.inProgress = true;
            file.sub = this._http.request(req).pipe(
                  map(event => {
                        switch (event.type) {
                              case HttpEventType.UploadProgress:
                                    file.progress = Math.round(event.loaded * 100 / event.total);
                                    break;
                              case HttpEventType.Response:
                                    return event;
                        }
                  }),
                  tap(message => { }),
                  last(),
                  catchError((error: HttpErrorResponse) => {
                        file.inProgress = false;
                        file.canRetry = true;
                        return of(`${file.data.name} upload failed.`);
                  })
            ).subscribe(
                  (event: any) => {
                        if (typeof (event) === 'object') {
                              this.removeFileFromArray(file);
                              this.complete.emit(event.body);
                        }
                  }
            );
      }

      private uploadFiles() {
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.value = '';

            this.files.forEach(file => {
                  this.uploadFile(file);
            });
      }

      private removeFileFromArray(file: FileUploadModel) {
            const index = this.files.indexOf(file);
            if (index > -1) {
                  this.files.splice(index, 1);
            }
      }

      close() {
            this.isOpen = false;
      }
}

export class FileUploadModel {
      data: File;
      state: string;
      inProgress: boolean;
      progress: number;
      canRetry: boolean;
      canCancel: boolean;
      sub?: Subscription;
}
