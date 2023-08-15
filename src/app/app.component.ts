import { Component, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// import { AdDirective } from './mainapp/content.directive';
// import { MessagesComponent } from './mainapp/messages/messages.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //@ViewChild(AdDirective, { static: true }) adHost!: AdDirective; //, read: ViewContainerRef

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "google",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/google.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "facebook",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "twitter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/twitter.svg")
    );
  }
  title = 'InfotainmentAdmin';
  getRouteAnimation(outlet) {

    return outlet.activatedRouteData.animation
  }

  // ngAfterViewInit() {
  //   const viewContainerRef = this.adHost.viewContainerRef;
  //   viewContainerRef.clear();
  //   const componentRef = viewContainerRef.createComponent<MessagesComponent>(MessagesComponent);
  //   console.log(componentRef);
  // }
}
