import { Inject, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import grapesjs from "grapesjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { codeEditor } from "../codeEditor/codeEditor.component";
import { ConnectedPosition, ScrollStrategy } from "@angular/cdk/overlay";
import gjsPreset from "grapesjs-preset-webpage";
import gjsBasicBlocks from "grapesjs-blocks-basic";
import gjsTabs from "grapesjs-tabs";
import gjsNavbar from "grapesjs-navbar";
import gjsForms from "grapesjs-plugin-forms";
import gjsFlexbox from "grapesjs-blocks-flexbox";
import gjsLorySlider from "grapesjs-lory-slider";
import gjsCustomCode from "grapesjs-custom-code";
import gjsStyleGradient from "grapesjs-style-gradient";
import gjsStyleBg from "grapesjs-style-bg";
import gjsPostCss from "grapesjs-parser-postcss";
var juice = require('juice');
import { ActivatedRoute } from "@angular/router";
import gjsCodeEditor from "grapesjs-component-code-editor";
import pluginCKE from "./ckeditor-plugin";
import pluginImageEditor from "./tui-image-editor";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: "app-content-builder",
  templateUrl: "./content-builder.component.html",
  styleUrls: ["./content-builder.component.scss"],
})
export class ContentbuilderComponent implements OnInit {
  $: any;
  pageContentModel: any;
  result: any;
  pageContent: any;
  customComponents: any;
  isHideAll = false;

  @ViewChild("gjs", { static: false }) editor: grapesjs.Editor;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public request: any,
    private dialogRef: MatDialogRef<ContentbuilderComponent>
  ) {


    if (request) {
      if (request.content) {
        this.pageContent = request.content;
      }

      if (request.custom_components) {
        this.customComponents = request.custom_components;
      }

    } else {
      this.pageContent = '';
    }
  }


  @Input() contentData: any;
  @Output() updatedData = new EventEmitter<string>();


  ngAfterViewInit() {
    window.setTimeout(function () {


      document.querySelectorAll('.gjs-pn-panel.gjs-pn-views.gjs-one-bg.gjs-two-color')[0].addEventListener("click", function () {
        
        let clickedbutton = document.querySelectorAll('.gjs-pn-views.gjs-pn-panel .gjs-pn-active')

        if (clickedbutton[0]) {
          document.querySelectorAll('.gjs-pn-panel.gjs-pn-views-container')[0]['style'].display = 'block';
        } else {
          document.querySelectorAll('.gjs-pn-panel.gjs-pn-views-container')[0]['style'].display = 'none';
        }
      })




      
      function moveNav(navValue) {

        addListeners(navValue);
        function addListeners(navValue) {

          var e = '.gjs-pn-options'
          document.querySelectorAll(navValue)[0].addEventListener('mousedown', (e) => {
            window.addEventListener('mousemove', divMove, true);
          }, false);
          window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', divMove, true);
          }, false);
        }
        function divMove(e) {

          if (navValue == '.gjs-pn-views') {

            var divContainer = document.querySelectorAll('.gjs-pn-views-container')[0];
            divContainer['style'].position = 'absolute';
            divContainer['style'].top = e.clientY - 15 + 'px';
            divContainer['style'].left = e.clientX + 40 + 'px';

            var div = document.querySelectorAll(navValue)[0];
            div['style'].position = 'absolute';
            div['style'].top = e.clientY + 60 + 'px';
            div['style'].left = e.clientX + -75 + 'px';

          }
          else if (navValue == '.gjs-pn-customButtonsPanel') {

            var div = document.querySelectorAll(navValue)[0];
            div['style'].position = 'absolute';
            div['style'].top = e.clientY + 100 + 'px';
            div['style'].left = e.clientX + -100 + 'px';

          } else {

            var div = document.querySelectorAll(navValue)[0];
            div['style'].position = 'absolute';
            div['style'].top = e.clientY + 'px';
            div['style'].left = e.clientX + 'px';

          }
        }
      }
      moveNav('.gjs-pn-options');
      moveNav('.gjs-pn-devices-c');
      moveNav('.gjs-pn-views');
      moveNav('.gjs-pn-customButtonsPanel');
      moveNav('div#styleManager');
      

    }, 5000);
  }



  async ngOnInit() {
    setTimeout(() => {
      this.loadGjs();
    }, 1250);
  }


  loadGjs() {

    var cd = this.pageContent;
    this.editor = grapesjs.init({
      container: "#gjs",
      plugins: [
        gjsPreset,
        gjsBasicBlocks,
        gjsForms,
        gjsNavbar,
        gjsTabs,
        gjsFlexbox,
        gjsPostCss,
        gjsLorySlider,
        gjsCustomCode,
        gjsStyleBg,
        gjsStyleGradient,
        gjsCodeEditor,
        pluginCKE,
        pluginImageEditor
      ],
      pluginsOpts: {
        gjsCodeEditor: {
          closedState: { pn: "15%", cv: "85%" },
          openState: { pn: "15%", cv: "85%" },
        },
      },
      forceClass: true,
      height: "100%",
      width: "100%",
      storageManager: false,
      fromElement: true,
      mediaCondition: "min-width", // default is `max-width`
    });

    this.editor.runCommand('fullscreen', { target: '#something' });


    let optionPanel = this.editor.Panels.getPanel("options");
    optionPanel.toJSON().buttons.add([
      {
        id: "save-page",
        className: "fa fa-floppy-o",
        attributes: { title: "Save" },
        command(editor) {
          const html = editor.getHtml();
          const css = editor.getCss();
          const Gjscomponents = JSON.stringify(editor.getComponents());
          document.getElementById("save_trigger").setAttribute("html", html);
          document.getElementById("save_trigger").setAttribute("css", css);
          document
            .getElementById("save_trigger")
            .setAttribute("Gjscomponents", Gjscomponents);
          document.getElementById("save_trigger").click();
        },
      },
    ]);

    this.editor.setComponents(cd, {
      avoidStore: false,
    });

    this.editor.Devices.add({
      // Without an explicit ID, the `name` will be taken. In case of missing `name`, a random ID will be created.
      id: 'tablet',
      name: 'Tablet',
      width: '900px', // This width will be applied on the canvas frame and for the CSS media
    });

    this.editor.Devices.add({
      id: 'tablet2',
      name: 'Tablet 2',
      width: '800px', // This width will be applied on the canvas frame
      widthMedia: '810px', // This width that will be used for the CSS media
      height: '600px', // Height will be applied on the canvas frame
    });


    var cc = this.customComponents;
    if (cc?.length > 0) {

      cc.forEach(element => {
        const type = element.type;
        const val = element.value;
        const plh = element.place_holder;
        const label = element.label;

        this.editor.BlockManager.add(type, {
          // label: label,
          
          category: 'Category',
          label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg> <p> ${label} </p>`,
          content: {
            type,
            val,
            plh,
          },
        })

        const dc = this.editor.DomComponents;
        const defType = dc.getType('default');
        this.editor.DomComponents.addType(type, {
          model: defType.model.extend({
            toHTML() {
              const tag = this.get('tagName');
              return `<div>${this.get('val')}</div>`;
            },
          }, {
            isComponent(el) {
              if (el.textContent == val) return { type };
            },
          }),
          view: defType.view.extend({
            render() {
              defType.view.prototype.render.apply(this, arguments);
              this.el.style = 'background-color: lightblue; display: inline-block; border-radius: 2px; padding: 2px 5px';
              this.el.innerHTML = this.model.get('plh');
              return this;
            },
          }),
        })

      });
    }

    let filtered = this.editor.BlockManager.getAll().filter(block =>
      block.get('category').id == 'Category');
    var newBlocksEl = this.editor.BlockManager.render(filtered, { external: true });

    setTimeout(function () {
      var customCompDiv = document.createElement("div");
      customCompDiv.id = 'custom-component-tab';
      customCompDiv.appendChild(newBlocksEl);
      let settingsConatiner = document.querySelector('.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color');
      settingsConatiner.appendChild(customCompDiv);
    }, 2000);

    let viewPanel = this.editor.Panels.getPanel("views");
    viewPanel.toJSON().buttons.add([
      {
        attributes: {
          title: "Custom Components",
        },
        className: "fa fa-file-code-o",
        command: {
          run: function (editor) {
            document.getElementById('custom-component-tab').style.display = 'block';
          },
          stop: function (editor) {
            document.getElementById('custom-component-tab').style.display = 'none';
          }
        },

        togglable: true,
        id: "custom-components",

      }])

  }




  saveGjsPage() {
    let html =
      document.getElementById("save_trigger").attributes["html"].value;
    let css = document.getElementById("save_trigger").attributes["css"].value;
    const data = juice(`<style> ${css} </style> ${html}`);
    this.dialogRef.close({ content: data })

    
  }







  closeStyleManager() {
    document.getElementById('styleManager').style.display = 'none';
  }

  hideAll() {
    if (this.isHideAll) {
      document.querySelectorAll('.gjs-pn-options')[0]['style'].display = 'block';
      document.querySelectorAll('.gjs-pn-views')[0]['style'].display = 'block';
      document.querySelectorAll('.gjs-pn-views-container')[0]['style'].display = 'block';
      document.querySelectorAll('.gjs-pn-devices-c')[0]['style'].display = 'block';
      document.querySelectorAll('.gjs-pn-customButtonsPanel')[0]['style'].display = 'block';

      this.isHideAll = false;
    } else {
      document.querySelectorAll('.gjs-pn-options')[0]['style'].display = 'none';
      document.querySelectorAll('.gjs-pn-views')[0]['style'].display = 'none';
      document.querySelectorAll('.gjs-pn-views-container')[0]['style'].display = 'none';
      document.querySelectorAll('.gjs-pn-devices-c')[0]['style'].display = 'none';
      document.querySelectorAll('.gjs-pn-customButtonsPanel')[0]['style'].display = 'none';
      this.isHideAll = true;
    }
  }

}
