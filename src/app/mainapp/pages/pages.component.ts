import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  SecurityContext,
  ContentChildren,
  QueryList,
  ContentChild,
} from '@angular/core';
import { ComponentPortal, DomPortal, Portal, TemplatePortal } from '@angular/cdk/portal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdDirective } from '../content.directive';
@Component({
  selector: 'app-pages',
  //template: '<ng-template [cdkPortalOutlet]="selectedPortal"></ng-template><ng-template #templatePortalContent>{{html}}</ng-template>',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  selectedPortal: Portal<any>;

  html: string = `<h1>Title</h1>
        <b>Hello, this is a template portal</b>
        <ng-container adHost></ng-container>
        <p>end of component</p>`;

  data: SafeHtml;
  templatePortal: TemplatePortal<any>;
  domPortal: DomPortal<any>;

  // @ContentChildren(AdDirective)
  // contents: QueryList<AdDirective>;
  currentTab: TemplateRef<any>;
  ctx = { title: 'This is content from the tabs component itself' };
  // @ViewChild(selector: 'container', opts: {read: ViewContainerRef})
  // container!: ViewContainerRef;

  @ViewChild('templatePortalContent') templatePortalContent: TemplateRef<unknown>;
  @ViewChild('domPortalContent') domPortalContent: ElementRef<HTMLElement>;
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective; //, read: ViewContainerRef

  //public templateRef: TemplateRef<unknown>;
  //@ContentChild(AdDirective) adHost!: AdDirective;

  constructor(private _viewContainerRef: ViewContainerRef, private sanitizer: DomSanitizer) { }
  private clearTimer: VoidFunction | undefined;

  ngOnInit() {
    this.data = this.sanitizer.sanitize(SecurityContext.HTML, this.html);
    // this.domPortal = new DomPortal(this.data);
    // this.selectedPortal = this.domPortal;


    // this._viewContainerRef.clear();
    // this._viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);
    // this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
    // this.selectedPortal = this.templatePortal;
    // const viewContainerRef = this.adHost.viewContainerRef;
    // viewContainerRef.clear();
    // const componentRef = viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);
    //this.templatePortal
    console.log("oninit content directive:");
    //console.log(this.adHost);
    // console.log(this.contents);

  }

  getAds() {
    const interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
    this.clearTimer = () => clearInterval(interval);
  }
  loadComponent() {
    //Working Code
    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    //const componentRef = viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);
    //console.log("componentRef");
    //console.log(componentRef);
  }
  ngOnDestroy() {
    this.clearTimer?.();
  }

  ngAfterViewInit() {
    console.log("oninit content directive:");
    //console.log(this.adHost);
    // console.log(this.contents);

    //this.componentPortal = new ComponentPortal(MessagesComponent);
    // console.log("message component:");
    // console.log(this.componentPortal.component);

    // console.log("content directive:");
    // console.log(this.content);
    // const viewContainerRef = this.content.viewContainerRef;
    // viewContainerRef.clear();
    // const componentRef = viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);

    // this._viewContainerRef.clear();
    // this._viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);
    //this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
    this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
    this.domPortalContent.nativeElement.innerHTML = this.html;
    //this.domPortal = new DomPortal(this.domPortalContent);
    this.domPortal = new DomPortal(this.data);

    //this.selectedPortal = this.componentPortal;
    this.selectedPortal = this.domPortal;
    //this.selectedPortal = this.templatePortal;

    //this.currentTab = this.templatePortalContent;
    this.getAds();


  }
}
