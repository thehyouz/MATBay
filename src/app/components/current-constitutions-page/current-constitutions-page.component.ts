import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
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
    public auth: AuthService,
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

}
