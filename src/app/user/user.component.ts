import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private router: Router, private socialAuthService: SocialAuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.socialAuthService.initState.subscribe(initState => {
      console.log('initState: ' + initState)
      this.refreshToken();
    })

    this.socialAuthService.authState.subscribe((user) => {
      console.log("auth state changed");
      console.log(user)
      this.userService.user = user;
      //this.refreshToken();
    });

  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(resp => {
        //this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
        this.refreshToken();
      });
  }

  getUser() {
    return this.userService.user;
  }

  refreshToken() {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.socialAuthService.signOut(true);
  }

}
