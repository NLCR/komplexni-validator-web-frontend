import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private socialUser: any;
  private backendUser: any;

  constructor(private backend: BackendService, private socialAuthService: SocialAuthService) { }

  // ngOnInit(): void {
  //   console.log("UserService.ngOnInit()");
  //   const user = this.getSocialUser();
  //   if (user) {
  //     //this.userService.setSocialUser(user);
  //     this.backend.updateAndVerifyUser(user.idToken).subscribe(result => {
  //       console.log(result);
  //       this.setBackendUser(result);
  //       //this.userService.setBackendUser(result);
  //       //this.router.navigate(['user']);
  //     });
  //   }
  // }

  // initialize(): Promise<void> {
  //   console.log("UserService.initialize()");
  //   // Initialization tasks here
  //   //return Promise.resolve();
  //   return new Promise<void>((resolve, reject) => {
  //     // Simulate an asynchronous task
  //     setTimeout(() => {
  //       console.log("Initialization task complete.");
  //       resolve();
  //     }, 2000); // Simulating a 2-second async task
  //   });
  // }



  public isAdmin() {
    return this.backendUser?.admin;
  }

  public isVerified() {
    return this.backendUser?.verified;
  }

  public getSocialUser() {
    //console.log("UserService.getSocialUser()");
    if (this.socialUser) {
      return this.socialUser;
    } else {
      const jsonDataString = localStorage.getItem('socialUser');
      if (jsonDataString) {
        this.socialUser = JSON.parse(jsonDataString);
        return this.socialUser;
      }
    }
  }

  public setSocialUser(socialUser: any) {
    //console.log("UserService.setSocialUser()");
    this.socialUser = socialUser;
    console.log("saving socialUser to local storage");
    localStorage.setItem('socialUser', JSON.stringify(socialUser));
  }

  public getBackendUser() {
    //console.log("UserService.getBackendUser()");
    return this.backendUser;
  }

  public setBackendUser(backendUser: any) {
    //console.log("UserService.setBackendUser()");
    this.backendUser = backendUser;
  }

  public clear() {
    console.log("UserService.clear()");
    this.socialUser = null;
    this.backendUser = null;
    localStorage.removeItem('socialUser');
    this.socialAuthService.signOut();
  }

  public isLoggedIn() {
    return this.socialUser && this.backendUser;
  }

}
