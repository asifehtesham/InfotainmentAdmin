import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

//import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from "grapesjs";
import Swal from "sweetalert2";

import {
  ConnectedPosition,
  Overlay,
  ScrollStrategy,
  ScrollStrategyOptions,
} from "@angular/cdk/overlay";

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

//////
import gjsPostCss from "grapesjs-parser-postcss";
///////

//import gjsImageEditor from "grapesjs-tui-image-editor";
//import gjsFs from "grapesjs-plugin-filestack";
// import  grapesFilestack  from "grapesjs-plugin-filestack";

import { PagesService } from "src/app/services/pages.service";
import { ComponentService } from "src/app/services/components.service";
import { Router, ActivatedRoute } from '@angular/router';
//////////




  


/////////
@Component({
  selector: "app-pagebuilder",
  templateUrl: "./Index.component.html",
  styleUrls: ["./Index.component.scss"],
})
export class Index implements OnInit {
  $: any;
  @ViewChild("gjs", { static: false }) editor: grapesjs.Editor;
  sideNavMode: string = "side";
  menus;
  isChatOpen: boolean = true;
  scrollStrategy: ScrollStrategy;

  customCss: string = "";
  customJs: string = "";
  customCdn: string = "";
  pageData: any;
  customComponent: any;
  customComponnets = [{name:'component-1', content:'<h2>Component 1 </h2>'},{name:'component-2', content:'Component 2 '}  ];

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

  



  constructor(private dialog: MatDialog, private pageService: PagesService, private componentService: ComponentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
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
      ],
      height: "100%",
      width: "100%",
      storageManager: false,
      mediaCondition: "min-width", // default is `max-width`
      layerManager: {},
    });




    this.pageService.loadData().subscribe(results => {
      console.log("pageService",results);
    });


    
      this.componentService.loadData().subscribe(results => {
        console.log("componentService",results);
      });




    const pageData = localStorage.getItem("pageResult");


    if (pageData) {
      var pageDataObj = JSON.parse(pageData);
      var pageComponent = JSON.parse(pageDataObj.gjsComponents);

      this.editor.setComponents(pageComponent, { avoidStore: false });
      this.editor.setStyle(pageDataObj.css);

      var iframe = document.getElementsByTagName("iframe");

      if (pageDataObj.customCss) {
        const customStyle = document.createElement("style");
        customStyle.innerHTML = pageDataObj.customCss;
        const customCssDiv = document.createElement("div");
        customCssDiv.id = "custom-css";
        customCssDiv.append(customStyle);
        iframe[0].contentDocument.head.append(customCssDiv);
      }

      if (pageDataObj.customJs) {
        const customJs = document.createElement("script");
        customJs.innerHTML = pageDataObj.customJs;
        const customJsDiv = document.createElement("div");
        customJsDiv.id = "custom-js";
        customJsDiv.append(customJs);
        iframe[0].contentDocument.head.append(customJsDiv);
      }

      if (pageDataObj.customCdn) {
        const customCdnDiv = document.createElement("div");
        customCdnDiv.innerHTML = pageDataObj.customCdn;
        customCdnDiv.id = "custom-cdn";
        var iframe = document.getElementsByTagName("iframe");
        iframe[0].contentDocument.head.append(customCdnDiv);
      }
    }


    



    console.error('.........................');
    console.log("this.route.snapshot.params",this.route.snapshot.params);

    
    console.log('.........................');
    
    
    let optionPanel = this.editor.Panels.getPanel("options");
    optionPanel.toJSON().buttons.add([
      {
        id: "save-page",
        className: "fa fa-floppy-o",
        attributes: { title: "Save" },
        command(editor) {
          localStorage.setItem(
            "gjsComponents",
            JSON.stringify(editor.getComponents())
          );
          localStorage.setItem("gjsHtml", editor.getHtml());
          localStorage.setItem("gjsCss", editor.getCss());
          document.getElementById("save_trigger").click();
        },
      },
      {
        id: "publish-page",
        className: "fa fa-share-square-o",
        attributes: { title: "Publish" },
        command(editor) {
          document.getElementById("publish_trigger").click();
        },
      },
      {
        id: "save-css",
        className: "fa fa-css3",
        attributes: { title: "Add Custom CSS" },
        command(editor) {
          const btnEdit = document.createElement("button");
          btnEdit.innerHTML = "Save";
          btnEdit.className = "gjs-btn-prim";
          btnEdit.onclick = function () {
            updateCss();
            modal.close();
          };
          const modal = editor.Modal;
          const container = document.createElement("div");
          modal.setTitle("Add Custom Css");
          container.innerHTML = ` <div>
                           <textarea style=" background: #322931;color: #d5d3d5; width:100%; height:250px" id="cssModal" class="form-control">${
                             localStorage.getItem("customCss")
                               ? localStorage.getItem("customCss")
                               : ""
                           }</textarea> 
                         </div>`;
          container.appendChild(btnEdit);
          modal.setContent(container);
          modal.open();
        },
      },
      {
        id: "save-js",
        className: "fa fa-jsfiddle",
        attributes: { title: "Add Custom Js" },
        command(editor) {
          const btnEdit = document.createElement("button");
          btnEdit.innerHTML = "Save";
          btnEdit.className = "gjs-btn-prim";
          btnEdit.onclick = function () {
            updateJs();
            modal.close();
          };
          const modal = editor.Modal;
          const container = document.createElement("div");
          modal.setTitle("Add Custom Js");
          container.innerHTML = ` <div>
                           <textarea style=" background: #322931;color: #d5d3d5; width:100%; height:250px" id="cssModal" class="form-control">${
                             localStorage.getItem("customJs")
                               ? localStorage.getItem("customJs")
                               : ""
                           }</textarea> 
                         </div>`;
          container.appendChild(btnEdit);
          modal.setContent(container);
          modal.open();
        },
      },
      {
        id: "save-cdn",
        className: "fa fa-window-restore",
        attributes: { title: "Add CDNs" },
        command(editor) {
          const btnEdit = document.createElement("button");
          btnEdit.innerHTML = "Save";
          btnEdit.className = "gjs-btn-prim";
          btnEdit.onclick = function () {
            updateCdn();
            modal.close();
          };
          const modal = editor.Modal;
          const container = document.createElement("div");
          modal.setTitle("Add Custom Cdn");
          container.innerHTML = ` <div>
                           <textarea style=" background: #322931;color: #d5d3d5; width:100%; height:250px" class="form-control">${
                             localStorage.getItem("customCdn")
                               ? localStorage.getItem("customCdn")
                               : ""
                           }</textarea> 
                         </div>`;
          container.appendChild(btnEdit);
          modal.setContent(container);
          modal.open();
        },
      },
      {
        id: "back-button",
        className: "fa fa-arrow-left",
        attributes: { title: "Back" },
        command(editor) {},
      },
      {
        id: "back-button",
        className: "fa fa-code",
        attributes: { title: "Custom Components" },
        command(editor) {},
      },
    ]);

    function updateCss() {
      localStorage.setItem(
        "customCss",
        document.getElementsByTagName("textarea")[0].value
      );
      var iframe = document.getElementsByTagName("iframe");

      if (document.getElementById("custom-css")) {
        document.getElementById("custom-css").remove();
      }

      const customStyle = document.createElement("style");
      customStyle.innerHTML = localStorage.getItem("customCss");
      const customCssDiv = document.createElement("div");
      customCssDiv.id = "custom-css";
      customCssDiv.append(customStyle);
      iframe[0].contentDocument.head.append(customCssDiv);
    }

    function updateJs() {
      localStorage.setItem(
        "customJs",
        document.getElementsByTagName("textarea")[0].value
      );

      var iframe = document.getElementsByTagName("iframe");

      if (document.getElementById("custom-js")) {
        document.getElementById("custom-js").remove();
      }

      const customJs = document.createElement("script");
      customJs.innerHTML = localStorage.getItem("customJs");
      const customJsDiv = document.createElement("div");
      customJsDiv.id = "custom-js";
      customJsDiv.append(customJs);
      iframe[0].contentDocument.head.append(customJsDiv);
    }

    function updateCdn() {
      localStorage.setItem(
        "customCdn",
        document.getElementsByTagName("textarea")[0].value
      );

      if (document.getElementById("custom-cdn")) {
        document.getElementById("custom-cdn").remove();
      }

      const customCdnDiv = document.createElement("div");
      customCdnDiv.innerHTML = localStorage.getItem("customCdn");
      customCdnDiv.id = "custom-cdn";
      var iframe = document.getElementsByTagName("iframe");
      iframe[0].contentDocument.head.append(customCdnDiv);
    }

    function saveComponent() {
      document.getElementById("cc_trigger").click();
    }
  }

  saveGjsPage() {
    this.pageData = {
      html: localStorage.getItem("gjsHtml"),
      css: localStorage.getItem("gjsCss"),
      customCss: localStorage.getItem("customCss"),
      customJs: localStorage.getItem("customJs"),
      customCdn: localStorage.getItem("customCdn"),
      gjsComponents: localStorage.getItem("gjsComponents"),
    };

    this.pageService.savePage(this.pageData).subscribe(
      (results) => {
        console.log("results", results);
      },
      (error) => {
        console.log("error", error);
      }
    );

    Swal.fire({
      title: "Congractulations!",
      text: "Your page has been saved successfully",
      icon: "success",
    });
  }

  publishGjsPage() {
    const data = {
      html: localStorage.getItem("gjsHtml"),
      css: localStorage.getItem("gjsCss"),
      customCss: localStorage.getItem("customCss"),
      customJs: localStorage.getItem("customJs"),
      customCdn: localStorage.getItem("customCdn"),
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



  saveCustomComponent(){

    this.customComponent = {
      customComponent: document.getElementsByTagName("textarea")[0].value,
      customComponentContent: localStorage.getItem("customComponentContent")
    };
    
    this.pageService.saveCustomComponent(this.customComponent).subscribe(results => {
        console.log("results",results);
    }, error => {
      console.log("error",error);
    });

    
  Swal.fire({
    title: 'Congractulations!',
    text: 'Your component has been created successfully',
    icon: 'success',
  })
  
  }


}
