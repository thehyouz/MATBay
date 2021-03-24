import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/manager/constitution-manager.service';
import { SongListManagerService } from 'src/app/services/manager/song-list-manager.service';
import { VoteManagerService } from 'src/app/services/manager/vote-manager.service';
import { Constitution, ConstitutionType } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { compareUserNameASC, User } from 'src/app/types/user';
import { GradeVote, RankVote } from 'src/app/types/vote';
import { ManageSongsWindowComponent } from '../manage-songs-window/manage-songs-window.component';
import { compareSongIdASC } from 'src/app/types/song';
import { RandomSongWindowComponent } from '../random-song-window/random-song-window.component';
import { LeaveConstitutionWindowComponent } from '../leave-constitution-window/leave-constitution-window.component';

@Component({
  selector: 'app-constitution-page',
  templateUrl: './constitution-page.component.html',
  styleUrls: ['./constitution-page.component.scss'],
  providers: [ SongListManagerService, VoteManagerService ]
})

export class ConstitutionPageComponent implements OnInit {
  public constitution: Constitution;

  public users: User[];
  public currentUser: User;
  public currentSection: CurrentSectionConstitution = CurrentSectionConstitution.SongList;
  public SelectionType: typeof CurrentSectionConstitution = CurrentSectionConstitution;
  public constitutionType: typeof ConstitutionType = ConstitutionType;

  public isConstitutionLoading: boolean = true;
  public isUserLoading: boolean = true;

  public votes: GradeVote[] | RankVote[];

  constructor(private constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore,
              private auth: AuthService,
              private dialog: MatDialog,
              private routes: ActivatedRoute,
              private songManager: SongListManagerService,
              private voteManager: VoteManagerService
  ) {}

  ngOnInit() {
    this.constitutionManager.constitutions.subscribe(newList => {
      if (newList === null) return;
      this.constitution = newList.find(x => {return x.id === this.routes.snapshot.paramMap.get('id')});

      this.songManager.init(this.constitution.id);
      this.voteManager.init(this.constitution.id, this.constitution.type);

      // Users
      this.users = [];
      this.afs.collection('users/').get().toPromise().then(users => {
        this.users = [];
        users.forEach(async user => {
          if (this.constitution.users.find(newUserID => newUserID === (user.data() as User).uid)) {
            this.users.push(user.data() as User);
          }
        });
        this.users = this.users.sort(compareUserNameASC);

        // Songs
        this.constitution.songs = this.songManager.songList.getValue();
        this.songManager.songList.subscribe(newSongs => {
          this.constitution.songs = [];
          newSongs.forEach(async song => {
            this.constitution.songs.push(song);
          });
          this.constitution.songs.sort(compareSongIdASC);

          // Votes
          this.votes = this.voteManager.votes.getValue();
          this.voteManager.votes.subscribe(newVotes => {
            this.votes = [];
            newVotes.forEach(async vote => {
              this.votes.push(vote);
            });

            this.isConstitutionLoading = false;
          });
        });
      });
    });

    // Current User
    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {this.isUserLoading = false;}
    });
  }

  openDialogManageSongs(): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      constitution: this.constitution,
      currentUser: this.currentUser
    }

    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '50%';
    dialogConfig.maxHeight = '80%';

    this.dialog.open(ManageSongsWindowComponent, dialogConfig);
  }

  openDialogRandomSong(): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      constitution: this.constitution,
    }

    dialogConfig.hasBackdrop = true;

    this.dialog.open(RandomSongWindowComponent, dialogConfig);
  }

  leaveConstitution(): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      constitution: this.constitution,
      votes: this.votes,
      currentUser: this.currentUser
    }

    this.dialog.open(LeaveConstitutionWindowComponent, dialogConfig);
  }

  returnOwner(): User {
    const user = this.users.find(x => x.uid === this.constitution.owner);
    if (user !== undefined) {
      return user;
    }
    return this.users[0];
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }

  numberOfSongsOfUser(uid: string): number {
    if (this.constitution.songs === undefined) return 0;
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
