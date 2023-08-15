import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { sideBarBottomIcons, sideBarTopIcons } from 'src/app/models/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public topIcons = sideBarTopIcons;
  public bottomIcons = sideBarBottomIcons;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
}
