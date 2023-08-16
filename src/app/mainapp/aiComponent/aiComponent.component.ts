import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConnectedPosition, ScrollStrategy, ScrollStrategyOptions } from "@angular/cdk/overlay";
import { Portal, ComponentPortal } from "@angular/cdk/portal";
import { TemplatesService } from "src/app/services/templates.service";
import { OpenAIService } from "src/app/services/openai.service";
import { ActivatedRoute } from "@angular/router";
import { ChatComponent } from "../chat/chat.component";




@Component({
  selector: "app-ai-component",
  templateUrl: "./aiComponent.component.html",
  styleUrls: ["./aiComponent.component.scss"],
})
export class aiComponent implements OnInit {

  sideNavMode: string = "side";
  menus;
  isMenuOpen = true;
  isHideAll = false;

  positions: ConnectedPosition[] = [{
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -108,
    offsetY: 50
  }];

  selectedPortal: Portal<any>;
  whiteBoard: ComponentPortal<ChatComponent>;
  isChatOpen: boolean;
  scrollStrategy: ScrollStrategy;
  @Output() sendResp: EventEmitter<any> = new EventEmitter();


  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar,
    private openAIService: OpenAIService,
    private scrollStrategies: ScrollStrategyOptions
  ) { }

  @Input() isDisplay: Boolean;
  @Input() type: String;
  @Input() typeValue: String;


  async ngOnInit() {
    
    console.log("typeValue aiComp   ... ",this.typeValue)
    
    
    this.scrollStrategy = this.scrollStrategies.block();
    
  }



  ngAfterViewInit() {
    this.whiteBoard = new ComponentPortal(ChatComponent);
    this.selectedPortal = this.whiteBoard;
  }

  async chatGpt_exe() {
    if (this.isChatOpen) {
      this.isChatOpen = false;
    } else {
      this.isChatOpen = true;
    }
    return false;
  }



  triggerAi() {
    if (this.isChatOpen) {
      this.isChatOpen = false;
    } else {
      this.isChatOpen = true;
    }
  }

  getRes(e) {
    console.log("ai component");
    console.log("e", e);

    this.sendResp.emit(e);
  }

  close() {

    this.isDisplay = false;
  }


  //   responseFormat
  // currentImageUrl
  // currentCode
  // currentText

}
