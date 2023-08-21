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
    const init = false;
    if (init) {

      const user = this.userService.getSocialUser();
      if (user) {
        console.log("user found in local storage");
        this.fetchBackendUser(user);
      } else {
        console.log("user NOT found in local storage");



        this.socialAuthService.initState.subscribe(initState => {
          console.log('initState: ' + initState)
          //this.refreshToken();
        })

        this.socialAuthService.authState.subscribe((user) => {
          console.log("socialAuthService.authState.subscribe()");
          console.log(user);
          console.log("auth state changed");
          console.log(user)
          //this.userService.socialUser = user;
          this.userService.setSocialUser(user);
          this.fetchBackendUser(user);
          //this.refreshToken();
        });
      }
    }

  }

  loginWithGoogle() {
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    //   .then(resp => {
    //     console.log("signIn() resp");
    //     //this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    //     this.refreshToken();
    //   });
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  getSocialUser() {
    //return this.userService.socialUser;
    return this.userService.getSocialUser();
  }

  getBackendUser() {
    //return this.userService.backendUser;
    return this.userService.getBackendUser();
  }

  refreshToken() {
    console.log("refreshToken()");
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    //this.socialAuthService.signOut(true);
    this.userService.clear();
    this.router.navigate(['about']);
  }

  test() {
    //this.fetchBackendUser(this.userService.socialUser);
    this.fetchBackendUser(this.userService.getSocialUser());
  }

  fetchBackendUser(user: any) {
    console.log("fetchBackendUser(): ");
    console.log(user);
    if (user) {
      this.backend.updateAndVerifyUser().subscribe(backendUser => {
        this.userService.setBackendUser(backendUser);
        console.log("fetchBackendUser(): backendUser: ");
        console.log(backendUser);
      });
    }
  }

}
