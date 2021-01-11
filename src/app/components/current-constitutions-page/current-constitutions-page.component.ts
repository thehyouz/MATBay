import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/manager/constitution-manager.service';
import { compareConstitutionASC, Constitution } from 'src/app/types/constitution';
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

  private users: User[];

  ngOnInit(): void {
    // get all users
    this.afs.collection("users/").get().toPromise().then(newUsers => {
      this.users = [];
      newUsers.forEach(async user => {
        this.users.push(user.data() as User);
      });
    });

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
      if (newList) {
        this.areConstitutionsLoading = false;
        this.constitutions.sort(compareConstitutionASC);
      }
    });
  }

  constructor(
    private constitutionManager: ConstitutionManagerService,
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {}

  showDisplayName(uid: string): string {
    let name = ""
    if (this.users !== undefined) {
      name = this.users.find(user => user.uid === uid).displayName;  
    }

    if (name !== undefined) {
      return name;
    }
    return "Error";
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
