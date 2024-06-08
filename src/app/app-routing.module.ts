import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { QuotasComponent } from './quotas/quotas.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { NewValidationComponent } from './validations/new-validation/new-validation.component';
import { ValidationComponent } from './validations/validation/validation.component';
import { ValidationsComponent } from './validations/validations.component';
import { ValidationXmlComponent } from './validations/validation-xml/validation-xml.component';

const routes: Routes = [
  { path: '', redirectTo: '/about' , pathMatch: 'full'},
  { path: 'user', component: UserComponent },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuardService] },
  { path: 'validations/xml', component: ValidationXmlComponent, canActivate: [AuthGuardService] },
  { path: 'validations', component: ValidationsComponent, canActivate: [AuthGuardService] },
  { path: 'validations/new', component: NewValidationComponent, canActivate: [AuthGuardService] },
  { path: 'validations/:id', component: ValidationComponent, canActivate: [AuthGuardService] },
  { path: 'quotas', component: QuotasComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] }
];

//TODO: predelat:
//validations/batch
//validations/batch/new
//validations/batch/:id
//validations/xml

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
