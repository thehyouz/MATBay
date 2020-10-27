import { Component } from '@angular/core';
import { Constitution } from 'src/app/types/constitution';

@Component({
  selector: 'app-constitutions-history-page',
  templateUrl: './constitutions-history-page.component.html',
  styleUrls: ['./constitutions-history-page.component.scss']
})
export class ConstitutionsHistoryPageComponent {

  constitutionHistory: Constitution[];

  constructor() {
    this.constitutionHistory = [];
  }

}
