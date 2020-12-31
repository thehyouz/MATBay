import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService, ConstitutionSongManagerService, ConstitutionUserManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song, compareSongConstitutionNumberASC } from 'src/app/types/song';
import { compareUserNameASC, User } from 'src/app/types/user';
import { VoteSOC } from 'src/app/types/vote';
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

  votes: VoteSOC[];

  ngOnInit() {
    this.constitutionManager.constitutions.subscribe(newList => {
      if (newList === null) return;
      this.constitution = newList.find(x => {return x.id === this.routes.snapshot.paramMap.get('id')});

      // Users
      this.users = [];
      this.afs.collection('users/').get().toPromise().then(users => {
        users.forEach(async user => {
          const data = user.data() as User;
          if (this.constitution.users.includes(data.uid) && !this.users.some(user => user.uid === data.uid)) {
            this.users.push(data);
          }
        });
        this.users = this.users.sort(compareUserNameASC);
      })

      // Songs
      this.constitution.songs = [];
      this.afs.collection('constitutions/').doc(this.constitution.id).collection('/songs').get().toPromise().then(songs => {
        songs.forEach(async song => {
          const data = song.data() as Song;
          if (!this.constitution.songs.some(song => song.id === data.id)) {
            this.constitution.songs.push(data);
          }
        });
        this.constitution.songs.sort(compareSongConstitutionNumberASC);
      })

      // Votes //TODO: Optimiser 
      this.votes = [];
      this.afs.collection('constitutions/').doc(this.constitution.id).collection("/votes").get().toPromise().then(votes => {
        votes.forEach(async vote => {
          const data = vote.data() as VoteSOC;
          if (!this.votes.some(vote => vote.id === data.id) && data.userID === this.currentUser.uid) {
            this.votes.push(data);
          }
        })
      })
      
      this.isConstitutionLoading = false;
    });

    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {this.isUserLoading = false;}
    });
  }

  constructor(public constitutionManager: ConstitutionManagerService,
              // public constitutionSongsManager: ConstitutionSongManagerService,
              // public constitutionUsersManager: ConstitutionUserManagerService,
              private afs: AngularFirestore,
              public auth: AuthService,
              private dialog: MatDialog,
              private routes: ActivatedRoute,
              private router: Router
  ) {}

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
      currentSection: this.currentSection,
      vote: this.votes.find(x => x.songID === song.constitutionNumber)
    }
    this.dialog.open(SongWindowComponent, dialogConfig);
  }

  returnVote(song: Song): number {
    return this.votes.find(x => x.songID === song.constitutionNumber).grade;
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

  leaveConstitution(): void {
    const index = this.constitution.users.findIndex(x => x === this.currentUser.uid);
    this.constitution.users.splice(index);

    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      users: this.constitution.users
    });

    this.router.navigate(['current-constitutions']);
  }

}
