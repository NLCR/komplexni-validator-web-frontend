import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

//TODO: fix?
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { QuotasComponent } from './quotas/quotas.component';
import { ValidationsComponent } from './validations/validations.component';
import { ValidationComponent } from './validations/validation/validation.component';
import { NewValidationComponent } from './validations/new-validation/new-validation.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { InitializerService } from './services/initializer.service';
import { AuthInterceptor } from './services/auth-interceptor';

export function initApp(initializerService: InitializerService) {
  return () => initializerService.initialize();
}


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ValidationsComponent,
    AboutComponent,
    QuotasComponent,
    NewValidationComponent,
    ValidationComponent,
    UserComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,

    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    InitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [InitializerService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        //autoLogin: true, //TODO:?
        autoLogin: false, //TODO:?
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '657833583166-05dul361gfjhje1mn04licsfokr8mrnn.apps.googleusercontent.com',
              {
                //scope: 'email',
                //ux_mode: 'redirect',
                //plugin_name: 'komplexnivalidatorweb', //https://github.com/abacritt/angularx-social-login/issues/504#issuecomment-1143312259
                oneTapEnabled: false, // default is true
              }
            )
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId')
          // }


        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
