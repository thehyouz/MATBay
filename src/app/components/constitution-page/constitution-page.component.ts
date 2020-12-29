import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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

export class ConstitutionPageComponent implements OnInit {

  public constitution: Constitution;

  public users: User[];
  public currentUser: User;

  public isConstitutionLoading: boolean = true;
  public isUserLoading: boolean = true;

  public currentSection: CurrentSectionConstitution = CurrentSectionConstitution.SongList;
  public SelectionType: typeof CurrentSectionConstitution = CurrentSectionConstitution;

  ngOnInit() {
    this.constitutionManager.constitutions.subscribe(newList => {
      if (newList === null) return;
      this.constitution = newList.find(x => {return x.id === this.routes.snapshot.paramMap.get('id')});

      this.users = [];
      this.afs.collection('users/').get().toPromise().then(users => {
        users.forEach(async user => {
          const data = user.data() as User;
          if (this.constitution.users.includes(data.uid)) {
            this.users.push(data);
          }
        });
        this.users = this.users.sort(this.compareUserName);
      })

      this.constitution.songs = [];
      this.afs.collection('constitutions/').doc(this.constitution.id).collection('/songs').get().toPromise().then(songs => {
        songs.forEach(async song => {
          const data = song.data() as Song;
          this.constitution.songs.push(data);
        });
        this.constitution.songs.sort(this.compareSongConstitutionNumber);
      })
      
      this.isConstitutionLoading = false;
    });

    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser)
        this.isUserLoading = false;
    });
  }

  constructor(public constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore,
              public auth: AuthService,
              private dialog: MatDialog,
              private routes: ActivatedRoute) {
  }

  compareUserName(user1: User, user2: User): number {
    if (user1.displayName > user2.displayName) {return 1;}
    if (user1.displayName < user2.displayName) {return -1;}
    return 0;
  }

  compareSongConstitutionNumber(song1: Song, song2: Song): number {
    if (song1.constitutionNumber > song2.constitutionNumber) { return 1; }
    if (song1.constitutionNumber < song2.constitutionNumber) { return -1; }
    return 0;
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
      constitution: this.constitution,
      currentSection: this.currentSection
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
    const isOwner = this.constitution.owner === this.currentUser.uid;

    return isCorrectSection && isOwner;
  }

}
