import { Component, OnInit } from '@angular/core';
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
export class CurrentConstitutionsPageComponent implements OnInit{
  public currentUser: User;
  public constitutions:Constitution[];

  public isUserLoading: boolean = true;
  public areConstitutionsLoading: boolean = true;

  ngOnInit() {
    // update current user
    this.currentUser = this.auth.user$.getValue();
    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {this.isUserLoading = false;} 
    });
    
    // update current constitution
    this.constitutions = this.constitutionManager.constitutions.getValue();
    this.constitutionManager.constitutions.subscribe(newList => {
      this.constitutions = newList;
      if (newList) {this.areConstitutionsLoading = false;}
    });
  }

  constructor(
    public constitutionManager: ConstitutionManagerService,
    public afs: AngularFirestore,
    public auth: AuthService,
  ) {}

  // TODO: Optimiser
  async showDisplayName(uid: string): Promise<string> {
    /* this.afs.collection('users/').get().toPromise().then(users => {
      const data = users.docs.find(x => x.id === uid).data() as User;
    }); */

    const name = ((await this.afs.doc<User>(`users/${uid}`).get().toPromise()).data() as User).displayName;
    return name;
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
