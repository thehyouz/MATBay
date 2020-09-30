import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentConstitutionsPageComponent } from './components/current-constitutions-page/current-constitutions-page/current-constitutions-page.component';

import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'current-constitutions', component: CurrentConstitutionsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
