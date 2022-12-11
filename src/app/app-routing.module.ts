import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { QuotasComponent } from './quotas/quotas.component';
import { NewValidationComponent } from './validations/new-validation/new-validation.component';
import { ValidationsComponent } from './validations/validations.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'validations', component: ValidationsComponent },
  { path: 'validations/new', component: NewValidationComponent },
  { path: 'quotas', component: QuotasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
