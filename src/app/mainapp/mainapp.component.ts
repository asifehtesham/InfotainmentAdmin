import { Component, OnInit, Input } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { draweranimation, drawercontentanimation } from '../animations';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainapp',
  templateUrl: './mainapp.component.html',
  styleUrls: ['./mainapp.component.scss'],
  animations: [draweranimation, drawercontentanimation]
})
export class MainappComponent implements OnInit {

  sideNavOpened: boolean = false;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = 'side';
  onlyPage: boolean = true;
  

  constructor(private media: MediaObserver, private route: Router) { }

  ngOnInit() {

    let routeUrl = this.route.url;
    if (routeUrl.search("app/design/") > 0) {
      this.onlyPage = false;
    }


  }

  getRouteAnimation(outlet) {

    return outlet.activatedRouteData.animation;
    //return outlet.isActivated ? outlet.activatedRoute : ''
  }


  sideBarToggler() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  toggleView() {
    if (this.media.isActive('gt-md')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.media.isActive('gt-xs')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.media.isActive('lt-sm')) {
      this.sideNavMode = 'over';
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }


}
