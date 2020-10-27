import { Injectable } from '@angular/core';
import { Constitution } from '../types/constitution';

@Injectable({
  providedIn: 'root'
})

export class ConstitutionManagerService {

  // actualConstitution: Constitution;
  constitutions: Constitution[];

  constructor() {
    this.constitutions = [];
  }
}
