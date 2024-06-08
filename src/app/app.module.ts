import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { QuotasComponent } from './quotas/quotas.component';
import { ValidationsComponent } from './validations/validations.component';
import { ValidationPackageComponent } from './validations/validation-package/validation-package.component';
import { ValidationPackageNewComponent } from './validations/validation-package-new/validation-package-new.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { InitializerService } from './services/initializer.service';
import { AuthInterceptor } from './services/auth-interceptor';

import { DatePipe } from '@angular/common';
import { ChangeQuotaDialogComponent } from './quotas/change-quota-dialog/change-quota-dialog.component';
import { ChangeUserRoleDialogComponent } from './users/change-user-role-dialog/change-user-role-dialog.component';
import { ValidationXmlComponent } from './validations/validation-xml/validation-xml.component';


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
    ValidationPackageNewComponent,
    ValidationPackageComponent,
    UserComponent,
    UsersComponent,
    ChangeQuotaDialogComponent,
    ChangeUserRoleDialogComponent,
    ValidationXmlComponent
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
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,

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
