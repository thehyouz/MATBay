import { Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GradedConstitutionPageComponent } from '../components/constitution-page/graded-constitution/constitution-page.component';
import { ROUTES } from "../constants/routes";

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

    const newRoute: Route = { path: "current-constitutions/" + constitutionID, component: GradedConstitutionPageComponent };
    ROUTES.push(newRoute);
    this.router.config.push(newRoute);
  }
}
