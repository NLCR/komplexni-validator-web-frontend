import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable, map, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private socialAuthService: SocialAuthService,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //console.log('AuthGuardService: canActivate()');
    //console.log(route);
    const path = route.routeConfig?.path;
    const pathParams = route.params;
    //console.log(path);

    if (this.userService.isAdmin()) {
      return true;
    }

    if (this.userService.isLoggedIn()) {
      return path == 'about' || path == 'user' || path == 'validations' || path == 'validations/new' || path == 'validations/:id';
    } else {
      return path == 'about';
    }

    // return this.socialAuthService.authState.pipe(
    //   map((socialUser: SocialUser) => !!socialUser),
    //   tap((isLoggedIn: boolean) => {
    //     if (!isLoggedIn) {
    //       //console.log('not logged in');
    //       this.router.navigate(['user']);
    //       console.log('AuthGuardService: NOT logged in')
    //     } else {
    //       console.log('AuthGuardService: logged in');
    //     }
    //   })
    // );
  }
}
