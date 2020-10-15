import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-current-constitutions-page',
  templateUrl: './current-constitutions-page.component.html',
  styleUrls: ['./current-constitutions-page.component.scss']
})
export class CurrentConstitutionsPageComponent {

  public constitutionList: Constitution[];

  constructor(
    public constitutionManager: ConstitutionManagerService,
    public afs: AngularFirestore,
    private routing: RoutingService
  ) {
    this.constitutionList = [];
    afs.collection('constitutions/').get().toPromise().then(constitutions => {
      constitutions.forEach(async constitution => {
        const data = constitution.data() as Constitution
        this.routing.addConstitutionRoute(data.name);
        data.owner = ((await this.afs.doc<User>(`users/${data.owner}`).get().toPromise()).data() as User).displayName;
        this.constitutionList.push(data);
      })
    });
  }

  removeSpaceInString(string: string): string {
    return string.replace(/\s/g, "");
  }

  joinConstitution(constitution: Constitution): void {
    this.goToConstitution(constitution);
  }

  goToConstitution(constitution: Constitution): void {
    this.constitutionManager.actualConstitution = this.constitutionList.find(x => x.name == constitution.name);
  }  

}
