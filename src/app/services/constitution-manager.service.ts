import { Injectable } from '@angular/core';
import { Constitution } from '../types/constitution';

@Injectable({
  providedIn: 'root'
})

// Temporaire

export class ConstitutionManagerService {

  constitutions: Constitution[];

  constructor() {
    this.constitutions = [];
  }
}
