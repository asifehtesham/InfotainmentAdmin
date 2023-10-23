import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import grapesjs from "grapesjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConnectedPosition, ScrollStrategy, ScrollStrategyOptions } from "@angular/cdk/overlay";

import { Portal, ComponentPortal } from "@angular/cdk/portal";

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
import { PagesService } from "src/app/services/pages.service";
import { ComponentService } from "src/app/services/components.service";

import { TemplatesService } from "src/app/services/templates.service";

import { OpenAIService } from "src/app/services/openai.service";



import { ActivatedRoute } from "@angular/router";

// import gjsCodeEditor from "grapesjs-component-code-editor";

// import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css';

import { codeEditor } from "../codeEditor/codeEditor.component";




import gjsRuler from 'grapesjs-rulers';


// import 'grapesjs/dist/css/grapes.min.css';
// import 'grapesjs-rulers/dist/grapesjs-rulers.min.css'


import pluginCKE from "./ckeditor-plugin";
import pluginImageEditor from "./tui-image-editor";
import { V } from "@angular/cdk/keycodes";
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: "app-pagebuilder",
  templateUrl: "./pagebuilder.component.html",
  styleUrls: ["./pagebuilder.component.scss"],
})
export class PagebuilderComponent implements OnInit {


  $: any;
  @ViewChild("gjs", { static: false }) editor: grapesjs.Editor;

  sideNavMode: string = "side";
  menus;

  html: string = "";
  css: string = "";
  customCss: string = "";
  customJs: string = "";
  customCdn: string = "";
  pageData: any;
  customComponentHtml: string = "";

  customComponent: any;

  templateComponent: any;
  contentId: any;
  pageContentModel: any;
  pageComponents: any;
  isMenuOpen = true;
  isHideAll = false;
  isChatOpen = false;
  gptType = '';
  gptTypeValue = null;

  currentSelectedTag = null;
  constructor(
    private dialog: MatDialog,
    private componentService: ComponentService,
    private templatesService: TemplatesService,
    private pageService: PagesService,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar,
    private openAIService: OpenAIService,
  ) { }

  async ngOnInit() {
    const slug = this.route.snapshot.params.slug;
    const type = this.route.snapshot.params.type;
    var pageContent;
    await this.pageService
      .getPageComponents(1000)
      .subscribe(async (results) => {
        this.pageComponents = results;

        if (type == "component") {
          await this.componentService
            .componentById(slug)
            .subscribe((results) => {
              this.pageContentModel = results;
              this.gjsAct(results, type, this.pageComponents);
            });
        } else if (type == "template") {
          await this.templatesService
            .templateById(slug)
            .subscribe((results) => {
              this.pageContentModel = results;
              this.gjsAct(results, type, this.pageComponents);
            });
        } else {
          await this.pageService.pageContentById(slug).subscribe((results) => {
            this.pageContentModel = results;
            this.gjsAct(results, type, this.pageComponents);
          });
        }
      });

    //
    // let filtered = this.editor.Blocks.getAll().filter(block=>  true);
    // const newBlocksEl = this.editor.Blocks.render(filtered,{ external: true });
    // document.getElementById('side_nav').append(newBlocksEl);


  }



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




  gjsAct(data, type, comp) {


    console.log("data", data);

    document
      .getElementById("save_trigger")
      .setAttribute("customCss", data.customCSS);

    document
      .getElementById("save_trigger")
      .setAttribute("customJs", data.customJS);

    document
      .getElementById("save_trigger")
      .setAttribute("cdnLinks", data.cdnLinks);

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
        // gjsCodeEditor,
        pluginCKE,
        pluginImageEditor,
        gjsRuler
      ],
      styleManager: {
        appendTo: "#style-manager",
      },
      selectorManager: {
        appendTo: '#styles-container',
      },
      assetManager: {
        assets: [
          {
            type: "image",
            src: "https://cloudsolutions.com.sa/images/logo/cloudsolutions-logo-trans.png",
            height: 350,
            width: 250,
            name: "displayName",
          },
          {
            type: "image",
            src: "https://cloudsolutions.com.sa/images/logo/cloudsolutions-logo-trans.png",
            height: 350,
            width: 250,
            name: "displayName",
          },
          {
            type: "image",
            src: "https://cloudsolutions.com.sa/images/logo/cloudsolutions-logo-trans.png",
            height: 350,
            width: 250,
            name: "displayName",
          },
        ],
      },
      height: "100%",
      width: "100%",
      storageManager: false,
      mediaCondition: "min-width", // default is `max-width`
    });

    //////////////////////////////////////////////////

    if (comp) {
      for (let index = 0; index < comp.length; index++) {
        this.editor.DomComponents.addType(`${comp[index].title}-comp`, {
          model: {
            defaults: {
              tagName: "div",
              name: `${comp[index].title}-comp`,
              content:
                ` <component slug="${comp[index].slug}">
                          ${comp[index].cdnLinks}` +
                `<style>${comp[index].customCSS}</style> ${comp[index].html}
                  </component>
                `,
              //style: comp[index].customCSS,
              script: comp[index].customJS,
              droppable: false,
              editable: false,

            },
          },
        });

        this.editor.BlockManager.add(`${comp[index].title}-block`, {
          category: 'Category',
          label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg> <p> ${comp[index].title} </p>`,
          content: { type: `${comp[index].title}-comp` },
        });
      }
    }

    ////////////////////////////////////////////////////////////


    this.editor.on("component:selected", (Component) => {



      this.test();
      //currentSelectedTagValue               


      if (Component.attributes.tagName) {
        this.currentSelectedTag = Component.attributes.tagName;
        this.gptTypeValue = this.editor.getSelected().getInnerHTML();
      }

      document.getElementById('styleManager').style.display = 'none';

      const newComponent = {
        icon: "fa fa-plus-square",
        title: "New component",
        id: "new-component",
      };

      const customHtml = {
        icon: "fa fa-file-code-o",
        title: "Custom Html",
        id: "custom-html",
      };

      const styleManager = {
        icon: "fa fa-wrench",
        title: "Style Manager",
        id: "style-manager",
      };

      const chtGpt = {
        icon: "fa fa-bolt",
        title: "ChatGPT",
        id: "chatGpt-img",
      };

      const defaultToolbar = Component.get("toolbar");

      let checkNewComp = true;
      let checkCustomHtml = true;
      let checkStyleManager = true;
      let checkchtGpt = true;

      defaultToolbar.filter((toolbar) => {


        if (toolbar.attributes != undefined) {
          if (toolbar.attributes.title === newComponent.title) {
            checkNewComp = false;
          }

          if (toolbar.attributes.title === customHtml.title) {
            checkCustomHtml = false;
          }

          if (toolbar.attributes.title === styleManager.title) {
            checkStyleManager = false;
          }

          if (toolbar.attributes.title === chtGpt.title) {
            checkchtGpt = false;
          }

        }
      });


      if (checkStyleManager) {
        defaultToolbar.unshift({
          id: styleManager.id,
          attributes: { class: styleManager.icon, title: styleManager.title },
          command(editor) {
            document.getElementById('styleManager').style.display = 'block';
          },
        });
        Component.set("toolbar", defaultToolbar);
      }

      if (checkCustomHtml) {
        defaultToolbar.unshift({
          id: customHtml.id,
          attributes: { class: customHtml.icon, title: customHtml.title },
          command(editor) {
            document
              .getElementById("save_trigger")
              .setAttribute("customComponent", editor.getSelected().toHTML());


            document
              .getElementById("save_trigger")
              .setAttribute("isComponent", '1');

            document.getElementById("openCustomHtml").click();
          },
        });
        Component.set("toolbar", defaultToolbar);
      }

      if (checkNewComp) {
        defaultToolbar.unshift({
          id: newComponent.id,
          attributes: { class: newComponent.icon, title: newComponent.title },
          command(editor) {
            document
              .getElementById("save_trigger")
              .setAttribute("customComponent", editor.getSelected().toHTML());


            document
              .getElementById("save_trigger")
              .setAttribute("isComponent", '1');


            const btnEdit = document.createElement("button");
            btnEdit.innerHTML = "Save";
            btnEdit.className = "gjs-btn-prim";
            btnEdit.onclick = function () {
              saveComponent();
              modal.close();
            };
            const modal = editor.Modal;
            const container = document.createElement("div");
            modal.setTitle("Save Component");
            container.innerHTML = ` <div>
      <textarea type="text" placeholder="Please enter your component name" style=" background: #322931;color: #d5d3d5; width:100%; height:30px" class="form-control" class="form-control"></textarea> </div>`;
            container.appendChild(btnEdit);
            modal.setContent(container);
            modal.open();
          },
        });
        Component.set("toolbar", defaultToolbar);
      }




      if (checkchtGpt) {

        defaultToolbar.unshift({
          id: chtGpt.id,
          attributes: { class: chtGpt.icon, title: chtGpt.title },
          command(editor) {
            document.getElementById("trigger_chtgpt_selected").click();
          },
        });
        Component.set("toolbar", defaultToolbar);
      }







    });

    const pageData = data;

    if (pageData) {
      if (type == "component") {
        this.editor.setComponents(pageData.html, {
          avoidStore: false,
        });
      } else {
        if (pageData.pageData != "") {
          this.editor.setComponents(JSON.parse(pageData.pageData), {
            avoidStore: false,
          });
        }
      }

      this.editor.setStyle(pageData.css);
      var iframe = document.getElementsByTagName("iframe");
      const customStyle = document.createElement("style");
      if (pageData.customCSS) {
        customStyle.innerHTML = pageData.customCSS;
      }
      const customCssDiv = document.createElement("div");
      customCssDiv.id = "custom-css";
      customCssDiv.append(customStyle);
      iframe[0].contentDocument.head.append(customCssDiv);


      const customJs = document.createElement("script");
      if (pageData.customJS) {
        customJs.innerHTML = pageData.customJS;
      }
      const customJsDiv = document.createElement("div");
      customJsDiv.id = "custom-js";
      customJsDiv.append(customJs);
      iframe[0].contentDocument.head.append(customJsDiv);

      const customCdnDiv = document.createElement("div");
      if (pageData.cdnLinks) {
        customCdnDiv.innerHTML = pageData.cdnLinks;
      }
      customCdnDiv.id = "custom-cdn";
      var iframe = document.getElementsByTagName("iframe");
      iframe[0].contentDocument.head.append(customCdnDiv);

    }


    function saveComponent() {
      document.getElementById("cc_trigger").click();
    }

    function saveTemplate() {
      document.getElementById("t_trigger").click();
    }


    const newPanel = this.editor.Panels.addPanel({
      id: 'customButtonsPanel',
      visible: true,
      buttons: [
        {
          id: "back",
          className: "fa fa-bolt",
          attributes: { title: "ChatGPT" },
          command(editor) {


            console.log(" before await call");
            document.getElementById("trigger_chtgpt").click();
            console.log(" after await call");


          },
        },
        {
          id: "back",
          className: "fa fa-arrow-left",
          attributes: { title: "Go to Dashboard" },
          command(editor) {
            window.history.back();
          },
        },
        {
          id: "save-page",
          className: "fa fa-floppy-o",
          attributes: { title: "Save Page" },
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
        {
          id: "save-template",
          className: "fa fa-download",
          attributes: { title: "Save as Template" },
          command(editor) {
            const html = editor.getHtml();
            const css = editor.getCss();
            const Gjscomponents = JSON.stringify(editor.getComponents());

            document.getElementById("save_trigger").setAttribute("html", html);
            document.getElementById("save_trigger").setAttribute("css", css);
            document
              .getElementById("save_trigger")
              .setAttribute("Gjscomponents", Gjscomponents);


            console.log("html+++", html);

            //////////////////////////////////////
            const btnEdit = document.createElement("button");
            btnEdit.innerHTML = "Save";
            btnEdit.className = "gjs-btn-prim";
            btnEdit.onclick = function () {
              saveTemplate();
              modal.close();
            };
            const modal = editor.Modal;
            const container = document.createElement("div");
            modal.setTitle("Save Template");
            container.innerHTML = ` <div>
<textarea type="text" placeholder="Please enter your template name" style=" background: #322931;color: #d5d3d5; width:100%; height:30px" class="form-control" class="form-control"></textarea> </div>`;
            container.appendChild(btnEdit);
            modal.setContent(container);
            modal.open();

          },
        },
        {
          id: "custom-code",
          className: "fa fa-css3",
          attributes: { title: "Custom Code" },
          command(editor) {

            document
              .getElementById("save_trigger")
              .setAttribute("customComponent", editor.getHtml());

            document
              .getElementById("save_trigger")
              .setAttribute("isComponent", '0');


            document.getElementById("openCustomHtml").click();
          },
        },
        {

          attributes: {
            title: 'Toggle Rulers'
          },
          context: 'toggle-rulers', //prevents rulers from being toggled when another views-panel button is clicked
          label: `<svg width="18" viewBox="0 0 16 16"><path d="M0 8a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5A.5.5 0 0 1 0 8z"/><path d="M4 3h8a1 1 0 0 1 1 1v2.5h1V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5h1V4a1 1 0 0 1 1-1zM3 9.5H2V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9.5h-1V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/></svg>`,
          command: 'ruler-visibility',
          id: 'ruler-visibility'

        },
      ]
    });



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

    const removedButton = this.editor.Panels.removeButton('views', 'open-sm');





    let cat_comp_button = document.querySelectorAll('span.gjs-pn-btn.fa.fa-file-code-o')[0];

    console.log("cat_comp_button", cat_comp_button);




  }

  saveGjsPage() {

    this.pageContentModel.html =
      document.getElementById("save_trigger").attributes["html"].value;
    this.pageContentModel.css =
      document.getElementById("save_trigger").attributes["css"].value;
    this.pageContentModel.pageData =
      document.getElementById("save_trigger").attributes["Gjscomponents"].value;
    if (document.getElementById("save_trigger").attributes["customCSS"]) {
      this.pageContentModel.customCSS =
        document.getElementById("save_trigger").attributes["customCSS"].value;
    }
    if (document.getElementById("save_trigger").attributes["customJS"]) {
      this.pageContentModel.customJS =
        document.getElementById("save_trigger").attributes["customJS"].value;
    }
    if (document.getElementById("save_trigger").attributes["cdnLinks"]) {
      console.log(
        `document.getElementById("save_trigger").attributes["cdnLinks"].value`,
        document.getElementById("save_trigger").attributes["cdnLinks"].value
      );
      this.pageContentModel.cdnLinks =
        document.getElementById("save_trigger").attributes["cdnLinks"].value;
    }
    this.pageContentModel.id = this.route.snapshot.params.slug;
    if (this.route.snapshot.params.type == "component") {
      this.pageService.updateCustomComponent(this.pageContentModel).subscribe(
        (results) => {
          this.snakbar.open(
            "Congractulations! Your component has been saved successfully.",
            "Ok",
            {
              duration: 2000,
            }
          );
        },
        (error) => {
          console.log("error", error);
        }
      );
    } else if (this.route.snapshot.params.type == "template") {
      this.templatesService.updateTemplate(this.pageContentModel).subscribe(
        (results) => {
          this.snakbar.open(
            "Congractulations! Your template has been saved successfully.",
            "Ok",
            {
              duration: 2000,
            }
          );
        },
        (error) => {
          console.log("error", error);
        }
      );
    } else {
      this.pageService.savePageContent(this.pageContentModel).subscribe(
        (results) => {
          console.log("results", results);

          this.snakbar.open(
            "Congractulations! Your page has been saved successfully.",
            "Ok",
            {
              duration: 2000,
            }
          );
        },
        (error) => {
          console.log("error", error);
        }
      );
    }
  }

  saveCustomComponent() {
    this.customComponent = {
      title: document.getElementsByTagName("textarea")[0].value,
      slug: document.getElementsByTagName("textarea")[0].value,
      pageData: "",
      html: document.getElementById("save_trigger").attributes[
        "customComponent"
      ].value,
      css: "",
      customCSS: "",
      customJS: "",
      cdnLinks: "",
    };
    this.pageService.saveCustomComponent(this.customComponent).subscribe(
      (results) => {
        console.log("results", results);
      },
      (error) => {
        console.log("error", error);
      }
    );

    this.snakbar.open(
      "Congractulations! Your component has been created successfully.",
      "Ok",
      {
        duration: 2000,
      }
    );
  }

  saveTemplate() {

    this.templateComponent = {
      title: document.getElementsByTagName("textarea")[0].value,
      slug: document.getElementsByTagName("textarea")[0].value,
      pageData: document.getElementById("save_trigger").attributes["gjscomponents"].value,
      html: document.getElementById("save_trigger").attributes["html"].value,
      css: document.getElementById("save_trigger").attributes["css"].value,
      customCSS:
        document.getElementById("save_trigger").attributes["customCSS"].value,
      customJS: document.getElementById("save_trigger").attributes["customJS"].value,
      cdnLinks: document.getElementById("save_trigger").attributes["cdnLinks"].value,
    };
    this.templatesService.add(this.templateComponent).subscribe(
      (results) => {
        console.log("results", results);
      },
      (error) => {
        console.log("error", error);
      }
    );

    this.snakbar.open(
      "Congractulations! Your template has been created successfully.",
      "Ok",
      {
        duration: 2000,
      }
    );
  }

  openModal() {
    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom CSS",
        content: "<h2>Custom html </h2>",
        type: "customCss",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openCustomCss() {

    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom CSS",
        content:
          document.getElementById("save_trigger").attributes["customCss"].value,
        type: "customCss",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.content) {
        document
          .getElementById("save_trigger")
          .setAttribute("customCss", result.content);
        var iframe = document.getElementsByTagName("iframe");
        if (document.getElementById("custom-css")) {
          document.getElementById("custom-css").remove();
        }
        const customStyle = document.createElement("style");
        customStyle.innerHTML = result.content;
        const customCssDiv = document.createElement("div");
        customCssDiv.id = "custom-css";
        customCssDiv.append(customStyle);
        iframe[0].contentDocument.head.append(customCssDiv);
      }
    });
  }


  async openCustomHtml() {



    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom Html",
        content:
          document.getElementById("save_trigger").attributes["customComponent"]
            .value,
        customCss:
          document
            .getElementById("save_trigger")
            .attributes["customCss"].value
        ,
        customJs:
          document
            .getElementById("save_trigger")
            .attributes["customJs"].value,
        cdnLinks:
          document
            .getElementById("save_trigger")
            .attributes["cdnLinks"].value,
        type: "customHtml",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

      // console.log("result.content .=.=",result.content)

      console.log("result", result);


      if (result?.content) {

        let c = result.content.toString();




        console.log(`document.getElementById("save_trigger").attributes["isComponent"].value`, document.getElementById("save_trigger").attributes["isComponent"].value);

        if (document.getElementById("save_trigger").attributes["isComponent"].value == '1') {
          
          
          console.log("this.editor.getSelected()",this.editor.getSelected()); 
          
          console.log("c",c);

          //c
          this.editor.getSelected().replaceWith('<div><h2>test </h2> </div>');
        
        
        
        } else {
          this.editor.setComponents(c, {
            avoidStore: false,
          });
        }


        document
          .getElementById("save_trigger")
          .setAttribute("isComponent", '0');



      }

      if (result?.customCss) {
        document
          .getElementById("save_trigger")
          .setAttribute("customCss", result.customCss);
      }
      if (result?.customJs) {
        document
          .getElementById("save_trigger")
          .setAttribute("customJs", result.customJs);
      }
      if (result?.cdnLinks) {
        document
          .getElementById("save_trigger")
          .setAttribute("cdnLinks", result.cdnLinks);
      }

    });
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



  // hi() {

  //   alert("hi");
  // }
  chatGpt_selected_comp() {

    let st = this.currentSelectedTag;
    if (st == 'p' || st == 'h1' || st == 'h2' || st == 'h3' || st == 'h4' || st == 'h5' || st == 'h6' || st == 'blockquote' || st == 'label' || st == 'label' || st == 'span') {
      this.gptType = "text";

    } else if (st == 'img') {
      this.gptType = "image";

    } else if (st == 'div') {
      this.gptType = "component";
    } else {

      return false;
    }


    console.log("st", st);
    console.log("this.gptType", this.gptType);

    if (!this.isChatOpen) {
      this.isChatOpen = true;
    }
    //return false;
  }

  async chatGpt_exe() {

    this.gptType = "page";
    if (this.isChatOpen) {
      this.isChatOpen = false;
    } else {
      this.isChatOpen = true;
    }
    return false;
  }



  getResp(e) {

    console.log("e.format", e.format);
    console.log("this.editor.getSelected()", this.editor.getSelected());


    let st = this.currentSelectedTag;

    if (e.format == "Image") {
      this.editor.getSelected().replaceWith(`<div><img src="${e.content}"> </div>`);
      return false;
    } else if (e.format == "HTML") {

      // if (this.editor.getSelected()) {

      //   this.editor.getSelected().replaceWith(e.content);

      // } else {
      this.editor.setComponents(e.content, {
        avoidStore: false,
      });
      // }

    } else {

      console.log("st", st);

      if (st == 'p' || st == 'h1' || st == 'h2' || st == 'h3' || st == 'h4' || st == 'h5' || st == 'h6' || st == 'blockquote' || st == 'label' || st == 'label' || st == 'span') {

        this.editor.getSelected().replaceWith(` <${st}>${e.content}</${st}>`);

        //this.editor.getSelected().replaceWith(` <${st}>${e.content}</${st}>`);

      } else {
        this.editor.getSelected().replaceWith(`<${st}>${e.content}</${st}>`);
      }


      return false;
    }


    // alert("page builder");
    // console.log("page builder component");
    // console.log("e", e);

  }



  test() {

    console.log("this.isChatOpen", this.isChatOpen);
    if (this.isChatOpen) {
      this.isChatOpen = false;
    }
    console.log("this.isChatOpen", this.isChatOpen);

  }



}
