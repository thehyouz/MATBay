import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';
import { ManageSongsWindowComponent } from '../manage-songs-window/manage-songs-window.component';

@Component({
  selector: 'app-constitution-page',
  templateUrl: './constitution-page.component.html',
  styleUrls: ['./constitution-page.component.scss']
})

export class ConstitutionPageComponent {

  public constitution: Constitution;

  public users: User[];
  public currentUser: User;

  constructor(public constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore,
              public auth: AuthService,
              private dialog: MatDialog) {
    this.users = [];
    this.constitution = this.constitutionManager.actualConstitution;
    
    this.constitution.users.forEach(async uid => {
      const user = ((await this.afs.doc<User>(`users/${uid}`).get().toPromise()).data() as User);
      this.users.push(user);
    });

    if(this.constitution.songs == null) {
      this.constitution.songs = [];
    }

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);
  }

  openDialog(): void {
    this.dialog.open(ManageSongsWindowComponent);
  }

  getSongIndex(url: string): number {
    return this.constitution.songs.findIndex(x => x.url == url);
  }

  numberOfSongsOfUser(uid: string): number {
    let i = 0;
    for (const song of this.constitution.songs) {
      if (song.patron == uid) {
        i++;
      }
    }
    return i;
  }

}
