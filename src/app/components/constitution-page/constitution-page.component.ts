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
import { compareResultScoreDSC, extractValuesOfVotesSOC, GradeVote, ResultGradeVote } from 'src/app/types/vote';
import { ManageSongsWindowComponent } from '../manage-songs-window/manage-songs-window.component';
import { Sort } from '@angular/material/sort';

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
  public results: ResultGradeVote[];

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
  
            // Results
            if (this.constitution.isShowingResult) {
              this.results = this.calculateResults();
            }

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

    dialogConfig.hasBackdrop = true;
    dialogConfig.maxWidth = '60%';
    dialogConfig.maxHeight = '70%';

    this.dialog.open(ManageSongsWindowComponent, dialogConfig);
  }

  sortDataResult(sort: Sort) {
    if(!sort.active || sort.direction === '') { return; }

    const data = this.results.slice();
    this.results = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case "id": return this.compare(a.songID, b.songID, isAsc);
        case "title": return this.compare(a.title, b.title, isAsc);
        case "author": return this.compare(a.author, b.author, isAsc);
        case "user": return this.compare(this.showDisplayName(a.userID), this.showDisplayName(b.userID), isAsc);
        case "score": return this.compare(a.score, b.score, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  returnOwner(): User {
    const user = this.users.find(x => x.uid === this.constitution.owner);
    if (user !== undefined) {
      return user;
    }
    return this.users[0];
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
    if (this.constitution.songs === undefined) return 0;
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
          songID: song.id,
          title: song.shortTitle,
          author: song.author,
          url: song.url,
          score: mean,
          userID: user.uid
        });
      }
    }

    results.sort(compareResultScoreDSC);

    if (this.constitution.winnerSongID !== results[0].songID && this.constitution.winnerUserID !== results[0].userID) {
      this.afs.collection("constitutions/").doc(this.constitution.id).update({
        winnerSongID: results[0].userID,
        winnerUserID: results[0].songID
      });
    }
    
    return results;
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

  canLockSongList(): boolean {
    return this.constitution.songs.length === this.constitution.numberMaxOfUser * this.constitution.numberOfSongsPerUser;
  }

  canPublishResults(): boolean {
    const numberOfVotes = this.constitution.numberOfSongsPerUser * this.constitution.numberMaxOfUser * (this.constitution.numberMaxOfUser - 1);
    return this.votes.length === numberOfVotes;
  }

  canFinishConstitution(): boolean {
    return this.constitution.winnerSongID !== -1 && this.constitution.winnerUserID !== '' && this.constitution.isShowingResult;
  }

  changeResultsStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isShowingResult: status
    });

    if (status) {
      this.results = this.calculateResults();
    }
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

  finishConstitution(): void {
    this.results.sort(compareResultScoreDSC);
    const winnerResult = this.results[0];

    this.afs.collection("history").add({
      season: this.constitution.season,
      round: this.constitution.round,
      name: this.constitution.name,
      ownerName: this.showDisplayName(this.constitution.owner),
      youtubePlaylistID: this.constitution.youtubePlaylistID,
      winnerName: this.showDisplayName(winnerResult.userID),
      winnerSongURL: winnerResult.url,
      winnerSongTitle: winnerResult.title,
      winnerSongAuthor: winnerResult.author
    });
    
    this.deleteConstitution();
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
