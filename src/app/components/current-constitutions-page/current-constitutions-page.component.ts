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
  public currentUser: User;

  constructor(
    public constitutionManager: ConstitutionManagerService,
    public afs: AngularFirestore,
    private routing: RoutingService,
    public auth: AuthService
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

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);
  }

  removeSpaceInString(string: string): string {
    return string.replace(/\s/g, "");
  }

  joinConstitution(constitution: Constitution): void {
    constitution.users.push(this.currentUser.uid);
    this.goToConstitution(constitution);
  }

  goToConstitution(constitution: Constitution): void {
    this.constitutionManager.actualConstitution = this.constitutionList.find(x => x.name === constitution.name);
  }

  isUserAlreadyAMember(constitution: Constitution): boolean {
    return constitution.users.find(x => x === this.currentUser.uid) !== undefined;
  }

}
