import { AngularEditorConfig } from '@kolkov/angular-editor';

export const environment = {
  apiUrl: "https://hmgpharmacyapi.hmg.com/cms/api/",
  production: true,
  CHAT_URL: "ws://localhost:5000/ws"
};


export const EditorConfig: AngularEditorConfig = {
  editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
  toolbarPosition: 'top'
  // toolbarHiddenButtons: [
  //   ['bold', 'italic'],
  //   ['fontSize']
  // ]
};
