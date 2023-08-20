import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getThumbnail() {
    return this.userService?.getSocialUser().photoUrl;
  }

  isThumbnailAvailable() {
    return this.userService?.getSocialUser();
  }

  isAdmin() {
    return this.userService.isLoggedIn() && this.userService.isAdmin();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

}
