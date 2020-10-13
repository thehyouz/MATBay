import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-constitution-page',
  templateUrl: './constitution-page.component.html',
  styleUrls: ['./constitution-page.component.scss']
})

export class ConstitutionPageComponent {

  public constitution: Constitution;
  public users: User[];

  constructor(public constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore) {
    this.users = [];
    this.constitution = this.constitutionManager.actualConstitution;
    
    this.constitution.users.forEach(async uid => {
      const user = ((await this.afs.doc<User>(`users/${uid}`).get().toPromise()).data() as User);
      this.users.push(user);
    });
    
    console.log(this.users);
  }

}
