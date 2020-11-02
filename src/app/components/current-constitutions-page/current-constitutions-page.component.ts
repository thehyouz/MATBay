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

  public currentUser: User;

  constructor(
    public constitutionManager: ConstitutionManagerService,
    public afs: AngularFirestore,
    private routing: RoutingService,
    public auth: AuthService
  ) {
    this.constitutionManager.constitutions = [];
    afs.collection('constitutions/').get().toPromise().then(constitutions => {
      constitutions.forEach(async constitution => {
        const data = constitution.data() as Constitution
        this.routing.addConstitutionRoute(data.name);
        data.owner = ((await this.afs.doc<User>(`users/${data.owner}`).get().toPromise()).data() as User).displayName;
        this.constitutionManager.constitutions.push(data);
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
  }

  isUserAlreadyAMember(constitution: Constitution): boolean {
    return constitution.users.find(x => x === this.currentUser.uid) !== undefined;
  }

}
