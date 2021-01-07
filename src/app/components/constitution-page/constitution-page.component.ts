import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/manager/constitution-manager.service';
import { MathService } from 'src/app/services/math.service';
import { SongListManagerService } from 'src/app/services/manager/song-list-manager.service';
import { VoteManagerService } from 'src/app/services/manager/vote-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song, compareSongIdASC } from 'src/app/types/song';
import { compareUserNameASC, User } from 'src/app/types/user';
import { compareResultScoreDSC, EMPTY_GRADE_VOTE, extractValuesOfVotesSOC, GradeVote, ResultGradeVote} from 'src/app/types/vote';
import { ManageSongsWindowComponent } from '../manage-songs-window/manage-songs-window.component';
import { SongWindowComponent } from '../song-window/song-window.component';

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
  
  public isConstitutionLoading: boolean = true;
  public isUserLoading: boolean = true;

  public votes: GradeVote[];

  ngOnInit() {
    this.constitutionManager.constitutions.subscribe(newList => {
      if (newList === null) return;
      this.constitution = newList.find(x => {return x.id === this.routes.snapshot.paramMap.get('id')});

      this.songManager.init(this.constitution.id);
      this.voteManager.init(this.constitution.id);

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
      })

      // Songs
      this.constitution.songs = this.songManager.songList.getValue();
      this.songManager.songList.subscribe(newSongs => {
        this.constitution.songs = [];
        newSongs.forEach(async song => {
          this.constitution.songs.push(song);
        });
        this.constitution.songs.sort(compareSongIdASC);
      });

      // Votes
      this.votes = this.voteManager.votes.getValue();
      this.voteManager.votes.subscribe(newVotes => {
        this.votes = [];
        newVotes.forEach(async vote => {
          this.votes.push(vote);
        });
      })
      
      this.isConstitutionLoading = false;
    });

    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {this.isUserLoading = false;}
    });
  }

  constructor(private constitutionManager: ConstitutionManagerService,
              private afs: AngularFirestore,
              private auth: AuthService,
              private dialog: MatDialog,
              private routes: ActivatedRoute,
              private router: Router,
              private math: MathService,
              private songManager: SongListManagerService,
              private voteManager: VoteManagerService
  ) {}

  openDialogManageSongs(): void {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      constitution: this.constitution,
      votes: this.votes
    }
    this.dialog.open(ManageSongsWindowComponent, dialogConfig);
  }

  openDialogSong(song: Song): void {
    const dialogConfig = new MatDialogConfig;

    let vote = this.votes.find(voteIterator => (voteIterator.songID === song.id) && (voteIterator.userID === this.currentUser.uid));
    if (vote === undefined) { vote = EMPTY_GRADE_VOTE; }

    dialogConfig.data = {
      song: song,
      constitution: this.constitution,
      currentSection: this.currentSection,
      vote: vote,
    }
    this.dialog.open(SongWindowComponent, dialogConfig);
  }

  returnVote(song: Song): number {
    const vote = this.votes.find(voteIterator => (voteIterator.songID === song.id) && (voteIterator.userID === this.currentUser.uid));
    if (vote !== undefined) {
      return vote.grade;
    }
    return -1;
  }

  userMeanVotes(uid: string): number {
    const currentUserVote: GradeVote[] = [];
    for (const vote of this.votes) {
      if (vote.userID === uid) {
        currentUserVote.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotesSOC(currentUserVote));
  }

  userMeanSongs(uid: string): number {
    const currentUserSongsVote: GradeVote[] = [];
    for (const vote of this.votes) {
      if (this.constitution.songs.find(x => x.id === vote.songID && x.patron === uid)) {
        currentUserSongsVote.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotesSOC(currentUserSongsVote));
  }

  userMeanUser(uid1: string, uid2: string): number {
    const user1Songs: Song[] = [];
    for (const song of this.constitution.songs) {
      if (song.patron === uid1) {
        user1Songs.push(song);
      }
    }
    const user2Votes: GradeVote[] = [];
    for (const vote of this.votes) {
      if (user1Songs.find(x => x.id === vote.songID && x.patron === uid1 && vote.userID === uid2)) { 
        user2Votes.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotesSOC(user2Votes));
  }

  calculateResults(): ResultGradeVote[] {
    const results: ResultGradeVote[] = [];
    for(const song of this.constitution.songs) {
      const selectedVotes = [];
      for(const vote of this.votes) {
        if (vote.songID === song.id) {
          selectedVotes.push(vote);
        }
      }
      const mean = this.math.mean(extractValuesOfVotesSOC(selectedVotes));
      const user = this.users.find(x => {return x.uid === song.patron});
      if (user !== undefined) {
        results.push({
          id: song.id,
          title: song.shortTitle,
          author: song.author,
          url: song.url,
          score: mean,
          user: user.displayName
        });
      }
    }
    results.sort(compareResultScoreDSC);
    return results;
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

  canLockSongList(): boolean {
    return this.constitution.songs.length === this.constitution.numberMaxOfUser * this.constitution.numberOfSongsPerUser;
  }

  canPublishResults(): boolean {
    const numberOfVotes = this.constitution.numberOfSongsPerUser * this.constitution.numberMaxOfUser * (this.constitution.numberMaxOfUser - 1);
    return this.votes.length === numberOfVotes;
  }

  canFinishConstitution(): boolean {
    return this.constitution.winnerSongIndex !== -1 && this.constitution.winnerUserIndex !== -1;
  }

  changeResultsStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isShowingResult: status
    });
  }

  changeLockStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isLocked: status
    });
  }

  leaveConstitution(): void {
    if (this.constitution.owner === this.currentUser.uid) return;
    
    const index = this.constitution.users.findIndex(x => x === this.currentUser.uid);
    this.constitution.users.splice(index);

    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      users: this.constitution.users
    });

    for (const song of this.constitution.songs) {
      if (song.patron === this.currentUser.uid) {
        this.afs.collection("constitutions/").doc(this.constitution.id).collection("/songs").doc(song.id.toString()).delete();
        for (const vote of this.votes) {
          if (vote.songID === song.id) {
            this.afs.collection("constitutions/").doc(this.constitution.id).collection("/votes").doc(vote.id).delete();
          }
        }
      }
    }

    for (const vote of this.votes) {
      if (vote.userID === this.currentUser.uid) {
        this.afs.collection("constitutions/").doc(this.constitution.id).collection("/votes").doc(vote.id).delete();
      }
    }

    this.router.navigate(['current-constitutions']);
  }

  deleteConstitution(): void {
    for (const vote of this.votes) {
      this.afs.collection("constitutions/").doc(this.constitution.id).collection("/votes").doc(vote.id).delete();
    }
    
    for (const song of this.constitution.songs) {
      this.afs.collection("constitutions/").doc(this.constitution.id).collection("/songs").doc(song.id.toString()).delete();
    }

    this.afs.collection("constitutions/").doc(this.constitution.id).delete();

    this.router.navigate(['current-constitutions']);
  }

}
