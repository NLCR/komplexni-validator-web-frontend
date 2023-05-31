import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { BackendService } from '../services/backend.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private router: Router, private socialAuthService: SocialAuthService, private userService: UserService, private backend: BackendService) {
  }

  ngOnInit(): void {
    this.socialAuthService.initState.subscribe(initState => {
      console.log('initState: ' + initState)
      this.refreshToken();
    })

    this.socialAuthService.authState.subscribe((user) => {
      console.log("auth state changed");
      console.log(user)
      this.userService.socialUser = user;
      this.fetchBackendUser(user);
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

  getSocialUser() {
    return this.userService.socialUser;
  }

  getBackendUser() {
    return this.userService.backendUser;
  }

  refreshToken() {
    console.log("refreshToken()");
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.socialAuthService.signOut(true);
  }

  test() {
    this.fetchBackendUser(this.userService.socialUser);
  }

  fetchBackendUser(user: any) {
    this.backend.updateAndVerifyUser(user.idToken).subscribe(backendUser => {
      this.userService.backendUser = backendUser;
    });
  }

}
