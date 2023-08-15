import { Component, OnInit, Input } from '@angular/core';
import { slidePanel, slidePanel1 } from 'src/app/animations';

@Component({
  selector: 'app-sidemenuitem',
  templateUrl: './sidemenuitem.component.html',
  styleUrls: ['./sidemenuitem.component.scss'],
  animations:[ slidePanel, slidePanel1]
})
export class SidemenuitemComponent implements OnInit {

  @Input() menu;
  @Input() iconOnly: boolean;
  @Input() secondaryMenu = false;

  constructor() { }

  ngOnInit() {
  }

  openLink() {
      this.menu.open = this.menu.open;
  }

  chechForChildMenu() {
      return (this.menu && this.menu.sub) ? true : false;
  }

}
