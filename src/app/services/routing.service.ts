import { Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from "../constants/routes";
import { ConstitutionPageComponent } from '../components/constitution-page/constitution-page.component';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  addConstitutionRoute(constitutionID: string): void {
    for(const route of ROUTES) {
      if (route.path.includes(constitutionID)) {
        return;
      }
    }

    const newRoute: Route = { path: "current-constitutions/" + constitutionID, component: ConstitutionPageComponent };
    ROUTES.push(newRoute);
    this.router.config.push(newRoute);
  }
}
