import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { QuotasComponent } from './quotas/quotas.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserComponent } from './user/user.component';
import { NewValidationComponent } from './validations/new-validation/new-validation.component';
import { ValidationComponent } from './validations/validation/validation.component';
import { ValidationsComponent } from './validations/validations.component';

const routes: Routes = [
  { path: '', component: AboutComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuardService] },
  { path: 'validations', component: ValidationsComponent, canActivate: [AuthGuardService] },
  { path: 'validations/new', component: NewValidationComponent, canActivate: [AuthGuardService] },
  { path: 'validations/:id', component: ValidationComponent, canActivate: [AuthGuardService] },
  { path: 'quotas', component: QuotasComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
