import { Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConstitutionPageComponent } from '../components/constitution-page/constitution-page.component';
import { ROUTES } from "../constants/routes";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  addConstitutionRoute(name: string): void {
    const newRoute: Route = { path: "current-constitutions/" + name.replace(/\s/g, ""), component: ConstitutionPageComponent };
    ROUTES.push(newRoute);
    this.router.config.push(newRoute);
  }
}
