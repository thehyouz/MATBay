import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-current-constitutions-page',
  templateUrl: './current-constitutions-page.component.html',
  styleUrls: ['./current-constitutions-page.component.scss']
})
export class CurrentConstitutionsPageComponent {

  public currentUser: User;
  public constitutions:Constitution[]

  constructor(
    public constitutionManager: ConstitutionManagerService,
    public afs: AngularFirestore,
    public auth: AuthService,
  ) {

    // update current user
    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    // update current constitution
    this.constitutions = this.constitutionManager.constitutions.getValue();
    this.constitutionManager.constitutions.subscribe(newList => this.constitutions = newList);
  }

  joinConstitution(constitution: Constitution): void {
    constitution.users.push(this.currentUser.uid);
    this.afs.collection("constitutions/").doc(constitution.id).update({
      users: constitution.users
    })
  }

  isUserAlreadyAMember(constitution: Constitution): boolean {
    return constitution.users.find(x => x === this.currentUser.uid) !== undefined;
  }

  isConstitutionFull(constitution: Constitution): boolean {
    return constitution.numberMaxOfUser == constitution.users.length;
  }

}
