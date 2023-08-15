import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of, Subscriber } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Category } from '../models/Category';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { IDataService, NodeContent } from 'ngx-explorer';
import { Attachment } from '../models/Attachment';
import { Folder } from '../models/Folder';

let MOCK_FOLDERS: Array<ExampleNode> = [];
let MOCK_FILES: Array<ExampleNode> = [];

// let MOCK_FOLDERS: Array<ExampleNode> = [
//   { id: 1, name: 'Music', path: 'music' },
//   { id: 2, name: 'Movies', path: 'movies' },
//   { id: 3, name: 'Books', path: 'books' },
//   { id: 4, name: 'Games', path: 'games' },
//   { id: 5, name: 'Rock', path: 'music/rock' },
//   { id: 6, name: 'Jazz', path: 'music/jazz' },
//   { id: 7, name: 'Classical', path: 'music/classical' },
//   { id: 15, name: 'Aerosmith', path: 'music/rock/aerosmith' },
//   { id: 16, name: 'AC/DC', path: 'music/rock/acdc' },
//   { id: 17, name: 'Led Zeppelin', path: 'music/rock/ledzeppelin' },
//   { id: 18, name: 'The Beatles', path: 'music/rock/thebeatles' },
// ];

// let MOCK_FILES: Array<ExampleNode> = [
//   { id: 428, name: 'notes.txt', path: '', content: 'hi, this is an example' },
//   { id: 4281, name: '2.txt', path: '', content: 'hi, this is an example' },
//   { id: 28, name: 'Thriller.txt', path: 'music/rock/thebeatles/thriller', content: 'hi, this is an example' },
//   { id: 29, name: 'Back in the U.S.S.R.txt', path: 'music/rock/thebeatles', content: 'hi, this is an example' },
//   { id: 30, name: 'All You Need Is Love.txt', path: 'music/rock/thebeatles', content: 'hi, this is an example' },
//   { id: 31, name: 'Hey Jude.txt', path: 'music/rock/ledzeppelin/heyjude', content: 'hi, this is an example' },
//   { id: 32, name: 'Rock And Roll All Nite.txt', path: 'music/rock/ledzeppelin/rockandrollallnight', content: 'hi, this is an example' },
// ];

interface ExampleNode {
  name: string;
  path: string;
  content?: string;
  id: number | string;
}

@Injectable({
  providedIn: 'root'
})

export class FileManagerService implements IDataService<ExampleNode>{

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  private id = 0;
  private folderId = 20;
  private isFolderLoad = false;
  private isFilesLoad = false;

  download(node: ExampleNode): Observable<any> {
    const file = MOCK_FILES.find(f => f.id === node.id);

    const myblob = new Blob([file.content], {
      type: 'text/plain'
    });
    const objectUrl = window.URL.createObjectURL(myblob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
    return of(null);
  }

  uploadFiles(node: ExampleNode, files: File[]): Observable<any> {
    const results = [];

    for (const file of files) {
      const obs = new Observable((observer: Subscriber<any>): void => {
        const reader = new FileReader();

        const id = ++this.id;

        reader.onload = () => {
          const nodePath = node ? MOCK_FOLDERS.find(f => f.id === node.id).path : '';
          const newFile = { id, name: file.name, path: nodePath + '/' + file.name, content: reader.result as string };
          MOCK_FILES.push(newFile);
          observer.next(reader.result);
          observer.complete();
        };
        reader.readAsText(file);
      });
      results.push(obs);
    }

    return forkJoin(results);
  }

  deleteNodes(nodes: ExampleNode[]): Observable<any> {
    const results = nodes.map(node => {
      const path = node.path + '/';
      MOCK_FILES = MOCK_FILES.filter(f => !f.path.startsWith(path));
      MOCK_FOLDERS = MOCK_FOLDERS.filter(f => !f.path.startsWith(path));
      MOCK_FOLDERS = MOCK_FOLDERS.filter(f => f.id !== node.id);
      return of({});
    });
    return forkJoin(results);
  }

  deleteLeafs(nodes: ExampleNode[]): Observable<any> {
    const results = nodes.map(node => {
      const leaf = MOCK_FILES.find(f => f.id === node.id);
      const index = MOCK_FILES.indexOf(leaf);
      MOCK_FILES.splice(index, 1);
      return of({});
    });
    return forkJoin(results);
  }

  createNode(node: ExampleNode, name: string): Observable<any> {
    console.log("createNode");
    console.log(node);

    const path = (node?.path ? node.path + '/' : '') + name.replace(/[\W_]+/g, ' ');
    //const id = ++this.folderId;
    const newFolder: Folder = { path, title: name, url: path };

    return this.http.post<any>(`${environment.apiUrl}folder`, newFolder)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);

          var files: ExampleNode = this.mapFile(data);

          console.log(files);
          //return files;

          console.log(files);
          MOCK_FOLDERS.push(files);
          console.log(MOCK_FOLDERS);
          return of(files);
        }),
      );

    // MOCK_FOLDERS.push(newFolder);
    // return of(newFolder);
  }

  getNodeChildren(node: ExampleNode): Observable<NodeContent<ExampleNode>> {
    console.log("getNodeChildren");
    console.log(node);

    if (!this.isFolderLoad) {

      // return of().pipe(

      //   map(data=> {
      //     MOCK_FOLDERS =  this.loadFolder().pipe(
      //       map(data => {
      //         return data;
      //         }
      //       ))
      //     }
      //   ));

      // MOCK_FOLDERS = this.loadFolder().pipe(
      //   map(data => {
      //     return data;
      //     }
      //   )
      // );

      this.loadFolder().subscribe(results => {
        this.isFolderLoad = true;
        return of(results);
        MOCK_FOLDERS = results;
        console.log("folder from api");
        console.log(MOCK_FOLDERS);
        this.getNodeChildren(null);
      });
    }
    if (this.isFilesLoad) {
      this.loadFiles().subscribe(results => {

        this.isFilesLoad = true;

        MOCK_FILES = results;
        console.log("files from api");
        console.log(MOCK_FILES);
        this.getNodeChildren(null);
      });
    }

    const folderPath = node?.path || '';

    const nodes = MOCK_FOLDERS.filter(f => {
      const paths = f.path.split('/');
      paths.pop();
      const filteredPath = paths.join('/');
      return filteredPath === folderPath;
    });

    const leafs = MOCK_FILES.filter(f => {
      const paths = f.path.split('/');
      paths.pop();
      const filteredPath = paths.join('/');
      return filteredPath === folderPath;
    });
    console.log(leafs);
    console.log(nodes);
    return of({ leafs, nodes });
  }

  renameNode(nodeInfo: ExampleNode, newName: string): Observable<ExampleNode> {
    const node = MOCK_FOLDERS.find(f => f.id === nodeInfo.id);
    node.name = newName;
    return of(node);
  }

  renameLeaf(leafInfo: ExampleNode, newName: string): Observable<ExampleNode> {
    const leaf = MOCK_FILES.find(f => f.id === leafInfo.id);
    leaf.name = newName;
    return of(leaf);
  }

  ////////////////////////////////////////API

  mapFolder(data: any) {
    var folder: ExampleNode = {
      id: data.id,
      name: data.title,
      path: data.path,
    };
    return folder;
  }

  mapFile(data: any) {
    var folder: ExampleNode = {
      id: data.id,
      name: data.title,
      path: data.path,
      content: data.data,
    };
    return folder;
  }

  loadFolder(): Observable<ExampleNode[]> {

    return this.http.get<any>(`${environment.apiUrl}folder`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);

          var folder: Array<ExampleNode> = data.data.map(x => this.mapFolder(x));

          console.log(folder);
          return folder;
        }),
      );
  }

  loadFiles(): Observable<ExampleNode[]> {

    return this.http.get<any>(`${environment.apiUrl}attachment`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);

          var files: Array<ExampleNode> = data.data.map(x => this.mapFile(x));

          console.log(files);
          return files;
        }),
      );
  }
}
