import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route, Router } from '@angular/router';
import { ConstitutionPageComponent } from './components/constitution-page/constitution-page.component';
import { ConstitutionsHistoryPageComponent } from './components/constitutions-history-page/constitutions-history-page.component';
import { CurrentConstitutionsPageComponent } from './components/current-constitutions-page/current-constitutions-page.component';

import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'current-constitutions', component: CurrentConstitutionsPageComponent },
  { path: 'constitutions-history', component: ConstitutionsHistoryPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {}

  addConstitutionRoute(name: string): void {
    const newRoute: Route = {path: "current-constitutions/" + name, component: ConstitutionPageComponent};
    routes.push(newRoute);
    this.router.config.push(newRoute);
  }
}
