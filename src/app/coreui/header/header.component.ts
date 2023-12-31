import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authenticationService: AuthService, private router: Router) {

  }

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    // setTimeout(() => {
    //   window.dispatchEvent(
    //     new Event('resize')
    //   );
    // }, 300);
  }

  signout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  changeLocale() {

  }
}
