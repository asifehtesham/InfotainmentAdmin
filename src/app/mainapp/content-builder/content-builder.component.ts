import { Inject, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";

import grapesjs from "grapesjs";
import { MatSnackBar } from "@angular/material/snack-bar";

import { ConnectedPosition, ScrollStrategy } from "@angular/cdk/overlay";


//import  gjsNewsletterPreset  from "grapesjs-preset-newsletter";

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


import { BlogService } from "src/app/services/blog.service";
import { TemplatesService } from "src/app/services/templates.service";
import { PagesService } from "src/app/services/pages.service";

import { inlineContent } from "juice";
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
  async ngOnInit() {

    console.log("this.contentData",this.contentData);



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



    ///////////////////// SIZES START //////////////////////

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


    //////////////////////// SIZES END ///////////////////

    ////////PLace holder variable start////////////////////////////////

    var cc = this.customComponents;

    if (cc?.length > 0) {
      cc.forEach(element => {

        const type = element.type;
        const val = element.value;
        const plh = element.place_holder;

        this.editor.BlockManager.add(type, {
          label: plh,
          content: {
            type,
            val,
            plh,
          },
        })

        let dc = this.editor.DomComponents;
        let defType = dc.getType('default');
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


    // Variable as placeholder



    const type = 'placeholder-var';
    const val = '{{ SOME_VAR_EXAMPLE_2 }}';
    const plh = "I'm a placeholder var, check the code";

    this.editor.BlockManager.add(type, {
      label: 'Placeholder var',
      content: {
        type,
        val,
        plh,
      },
    })

  }


  saveGjsPage() {
    let html =
      document.getElementById("save_trigger").attributes["html"].value;
    let css = document.getElementById("save_trigger").attributes["css"].value;
    const data = juice(`<style> ${css} </style> ${html}`);
    //this.updatedData.emit(data)
    this.dialogRef.close({ content: data })
  }










}
