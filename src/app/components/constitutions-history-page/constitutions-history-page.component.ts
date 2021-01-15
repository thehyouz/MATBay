import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConstitutionHistoryManagerService } from 'src/app/services/manager/constitution-history-manager.service';
import { compareConstitutionASC, ConstitutionArchived } from 'src/app/types/constitution';

@Component({
  selector: 'app-constitutions-history-page',
  templateUrl: './constitutions-history-page.component.html',
  styleUrls: ['./constitutions-history-page.component.scss']
})
export class ConstitutionsHistoryPageComponent implements OnInit {

  public constitutions: ConstitutionArchived[];
  public areConstitutionsLoading: boolean = true;

  ngOnInit(): void {
    // update history
    this.constitutions = this.constitutionsHistoryManager.constitutions.getValue();
    this.constitutionsHistoryManager.constitutions.subscribe(newList => {
      this.constitutions = newList;
      if (newList) {
        this.areConstitutionsLoading = false;
        this.constitutions.sort(compareConstitutionASC);
      }
    });
  }

  constructor(private afs: AngularFirestore,
              private constitutionsHistoryManager: ConstitutionHistoryManagerService) {}

}
