import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private socialAuthService: SocialAuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(state)
    return this.socialAuthService.authState.pipe(
      map((socialUser: SocialUser) => !!socialUser),
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          //console.log('not logged in');
          this.router.navigate(['user']);
          console.log('AuthGuardService: NOT logged in')
        } else {
          console.log('AuthGuardService: logged in');
        }
      })
    );
  }
}
