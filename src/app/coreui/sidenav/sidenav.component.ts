import { Component, OnInit, Input } from '@angular/core';
import { menus } from 'src/app/models/menu';
//import { Variable } from '@angular/compiler/src/render3/r3_ast';

import { User } from 'src/app/models/Users';
import { first } from 'rxjs/operators';
import { slidePanel, slidePanel1 } from "../../animations";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [slidePanel, slidePanel1]
})
export class SidenavComponent implements OnInit {

  constructor() { }
  //constructor(user: User) { 
  //this.user = user;
  //}

  @Input() iconOnly: boolean = false;
  public menus = menus;
  public user: User;
  public username: string;
  public useremail: string;

  ngOnInit() {
    this.user = new User();
    this.user.firstName = "Asif"
    this.user.lastName = "Ehtesham"
    this.user.title = "Software Engineer"

    this.username = this.user.firstName + ' ' + this.user.lastName;
    this.useremail = this.user.title;

  }
}
