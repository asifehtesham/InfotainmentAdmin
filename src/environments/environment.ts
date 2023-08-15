// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const environment = {
  apiUrl: "/api/",
  siteUrl: "http://10.201.204.180:9203",
  //CHAT_URL: "ws://echo.websocket.org/",
  CHAT_URL: "ws://localhost:5000/ws",
  OPENAI_API_KEY: "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",
  production: false
};

export const EditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '5rem',
  minHeight: '5rem',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
  defaultFontSize: '2',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  //uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
  // toolbarHiddenButtons: [
  //   ['bold', 'italic'],
  //   ['fontSize']
  // ]
  toolbarHiddenButtons: [
    [
      // 'customClasses',
      // 'toggleEditorMode'
    ]
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
