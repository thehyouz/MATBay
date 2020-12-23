import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { ManageSongsWindowComponent } from '../manage-songs-window/manage-songs-window.component';
import { SongWindowComponent } from '../song-window/song-window.component';

@Component({
  selector: 'app-constitution-page',
  templateUrl: './constitution-page.component.html',
  styleUrls: ['./constitution-page.component.scss']
})

export class ConstitutionPageComponent {

  public constitution: Constitution;

  public users: User[];
  public currentUser: User;

  public currentSection: CurrentSectionConstitution = CurrentSectionConstitution.SongList;
  public SelectionType: typeof CurrentSectionConstitution = CurrentSectionConstitution;

  constructor(public constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore,
              public auth: AuthService,
              private dialog: MatDialog,
              private router: Router) {
    this.users = [];
    this.constitution = this.constitutionManager.constitutions.find(x => this.router.url.includes(x.id));
    
    this.constitution.users.forEach(async uid => {
      const user = ((await this.afs.doc<User>(`users/${uid}`).get().toPromise()).data() as User);
      this.users.push(user);
    });

    this.constitution.songs = [];

    afs.collection('constitutions/').doc(this.constitution.id).collection('/songs').get().toPromise().then(songs => {
      songs.forEach(async song => {
        const data = song.data() as Song;
        this.constitution.songs.push(data);
      })
    })

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);
  }

  openDialogManageSongs(): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      constitution: this.constitution
    }
    this.dialog.open(ManageSongsWindowComponent, dialogConfig);
  }

  openDialogSong(song: Song): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      song: song,
      constitution: this.constitution
    }
    this.dialog.open(SongWindowComponent, dialogConfig);
  }

  showDisplayName(uid: string): string {
    for (const user of this.users) {
      if (user.uid == uid) {
        return user.displayName;
      }
    }
    return "";
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

  changeCurrentSection(newSection: CurrentSectionConstitution): void {
    this.currentSection = newSection;
  }

  showOwnerInfo(): boolean {
    const isCorrectSection = this.currentSection === this.SelectionType.Owner;
    const isOwner = this.constitution.owner === this.showDisplayName(this.currentUser.uid);
    
    return isCorrectSection && isOwner;
  }

}
