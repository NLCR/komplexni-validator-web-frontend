import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private backend: BackendService, private socialAuthService: SocialAuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    // this.backend.test().subscribe(result => {
    //   console.log(result);
    // })

    this.socialAuthService.initState.subscribe(initState => {
      console.log('initState: ' + initState)
      //this.refreshToken();
    })

    this.socialAuthService.authState.subscribe((user) => {
      console.log("socialAuthService.authState.subscribe()");
      console.log(user);
      if (user) {
        this.userService.setSocialUser(user);
        this.backend.updateAndVerifyUser().subscribe(result => {
          console.log(result);
          this.userService.setBackendUser(result);
          //this.router.navigate(['validations', 'package']);
        });
      }
    });


  


    //console.log("auth state changed");
    //console.log(user)
    //this.userService.socialUser = user;
    //this.userService.setSocialUser(user);
    //this.fetchBackendUser(user);
    //this.refreshToken();

  }

  showDevButtons(){
    return false;
  }

  testRequest() {
    this.backend.getQuotas().subscribe(result => {
      console.log(result);
    })
  }

  clearUserServiceData() {
    console.log('AboutComponent.clearUserServiceData()');
    this.userService.clear();
    //this.router.navigate(['user']);
  }

  logUserServiceData() {
    console.log('AboutComponent.logUserServiceData()');
    console.log('social user:');
    console.log(this.userService.getSocialUser());
    console.log('backend user:')
    console.log(this.userService.getBackendUser());

    //console.log(this.userService.socialUser);
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

  isLoggedIn() {
    return this.userService.getSocialUser() != null && this.userService.getBackendUser() != null;
  }

}
