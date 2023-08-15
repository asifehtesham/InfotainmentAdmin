import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import grapesjs from "grapesjs";
import { MatSnackBar } from "@angular/material/snack-bar";
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
import { PagesService } from "src/app/services/pages.service";
import { ComponentService } from "src/app/services/components.service";

import { TemplatesService } from "src/app/services/templates.service";

import { ActivatedRoute } from "@angular/router";

// import gjsCodeEditor from "grapesjs-component-code-editor";

// import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css';

import { codeEditor } from "../codeEditor/codeEditor.component";




import gjsRuler from 'grapesjs-rulers';


// import 'grapesjs/dist/css/grapes.min.css';
// import 'grapesjs-rulers/dist/grapesjs-rulers.min.css'


import pluginCKE from "./ckeditor-plugin";
import pluginImageEditor from "./tui-image-editor";
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
  isChatOpen: boolean = true;
  scrollStrategy: ScrollStrategy;

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
  // customComponnets = [
  //   { name: "component-1", content: "<h2>Component 1 </h2>" },
  //   { name: "component-2", content: "Component 2 " },
  // ];

  positions: ConnectedPosition[] = [
    {
      originX: "end",
      originY: "top",
      overlayX: "end",
      overlayY: "top",
      offsetX: -58,
      offsetY: 0,
    },
  ];

  constructor(
    private dialog: MatDialog,
    private componentService: ComponentService,
    private templatesService: TemplatesService,
    private pageService: PagesService,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar
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












      /////////////////////////





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

      //let nav1 ='.gjs-pn-options';

      moveNav('.gjs-pn-options');
      moveNav('.gjs-pn-devices-c');
      moveNav('.gjs-pn-views');
      moveNav('.gjs-pn-customButtonsPanel');
      moveNav('div#styleManager');





      //moveNav('.gjs-pn-views-container');










      // document.querySelectorAll('#gjs')[0]



      ///////////////////////////

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
      // pluginsOpts: {
      //   gjsCodeEditor: {
      //     closedState: { pn: "15%", cv: "85%" },
      //     openState: { pn: "15%", cv: "85%" },
      //   },
      // },
      // pluginsOpts: {
      //   "grapesjs-tui-image-editor": {
      //     config: {
      //       includeUI: {
      //         initMenu: "filter",
      //       },
      //     },
      //   },
      // },

      styleManager: {
        appendTo: "#style-manager",
      },
      // layerManager: {
      //   appendTo: "#layer-manager",
      // },

      selectorManager: {
        appendTo: '#styles-container',
      },
      // layerManager: {
      //   appendTo: '#layers-container',
      // },
      // traitManager: {
      //   appendTo: '#trait-container',
      // },


      assetManager: {
        assets: [
          //'https://cloudsolutions.com.sa/images/logo/cloudsolutions-logo-trans.png',
          // Pass an object with your properties
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

    /////////////////////////////////////////////////////////////
    console.log("comp", comp);
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

      const defaultToolbar = Component.get("toolbar");
      let checkNewComp = true;
      let checkCustomHtml = true;
      let checkStyleManager = true;

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
          id: "save-css",
          className: "fa fa-css3",
          attributes: { title: "Add Custom CSS" },
          command(editor) {
            document.getElementById("openCustomCss").click();
          },
        },
        {
          id: "save-js",
          className: "fa fa-jsfiddle",
          attributes: { title: "Add Custom Js" },
          command(editor) {
            document.getElementById("openCustomJs").click();
          },
        },
        {
          id: "save-cdn",
          className: "fa fa-window-restore",
          attributes: { title: "Add CDNs" },
          command(editor) {
            document.getElementById("openCustomCdn").click();

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



    document.querySelectorAll('.gjs-pn-buttons .gjs-pn-btn')[19]['style'].display = 'none';

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
          console.log("results", results);

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
          console.log("results", results);

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


    console.log("...........", document.getElementById("save_trigger").attributes["html"].value);

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

  publishGjsPage() {
    const data = {
      html: document.getElementById("save_trigger").attributes["gjsHtml"],
      css: document.getElementById("save_trigger").attributes["gjsCss"],
      customCss:
        document.getElementById("save_trigger").attributes["customCss"],
      customJs: document.getElementById("save_trigger").attributes["customJs"],
      customCdn: document.getElementById("save_trigger").attributes["cdnLinks"],
    };

    this.pageService.publishPage(this.pageData).subscribe(
      (results) => {
        console.log("results", results);
      },
      (error) => {
        console.log("error", error);
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
      //console.log("result.content", result.content);
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
  openCustomHtml() {
    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom Html",
        content:
          document.getElementById("save_trigger").attributes["customComponent"]
            .value,
        type: "customHtml",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.content) {
        this.editor.getSelected().replaceWith(result.content);

        //this.editor.getSelected
        // document
        //   .getElementById("save_trigger")
        //   .setAttribute("customHtml", result.content);
        // var iframe = document.getElementsByTagName("iframe");
        // if (document.getElementById("custom-js")) {
        //   document.getElementById("custom-js").remove();
        // }
        // const customJs = document.createElement("script");
        // customJs.innerHTML = result.content;
        // const customJsDiv = document.createElement("div");
        // customJsDiv.id = "custom-js";
        // customJsDiv.append(customJs);
        // iframe[0].contentDocument.head.append(customJsDiv);
      }
    });
  }

  openCustomJs() {
    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom Js",
        content:
          document.getElementById("save_trigger").attributes["customJs"].value,
        type: "customJs",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.content) {
        document
          .getElementById("save_trigger")
          .setAttribute("customJs", result.content);
        var iframe = document.getElementsByTagName("iframe");
        if (document.getElementById("custom-js")) {
          document.getElementById("custom-js").remove();
        }
        const customJs = document.createElement("script");
        customJs.innerHTML = result.content;
        const customJsDiv = document.createElement("div");
        customJsDiv.id = "custom-js";
        customJsDiv.append(customJs);
        iframe[0].contentDocument.head.append(customJsDiv);
      }
    });
  }
  openCustomCdn() {
    const dialogRef = this.dialog.open(codeEditor, {
      width: "650px",
      data: {
        title: "Custom CDN",
        content:
          document.getElementById("save_trigger").attributes["cdnLinks"].value,
        type: "customCdn",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.content) {
        document
          .getElementById("save_trigger")
          .setAttribute("cdnLinks", result.content);

        var iframe = document.getElementsByTagName("iframe");
        if (document.getElementById("custom-cdn")) {
          document.getElementById("custom-cdn").remove();
        }

        const customCdnDiv = document.createElement("div");
        customCdnDiv.innerHTML = result.content;
        customCdnDiv.id = "custom-cdn";
        var iframe = document.getElementsByTagName("iframe");
        iframe[0].contentDocument.head.append(customCdnDiv);
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




  // ...................
}
