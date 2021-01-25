import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { Constitution } from 'src/app/types/constitution';
import { GradeVote } from 'src/app/types/vote';

@Component({
  selector: 'ranked-owner-section',
  templateUrl: './owner-section.component.html',
  styleUrls: ['./owner-section.component.scss']
})
export class RankedOwnerSectionComponent {

  /* @Input() constitution: Constitution;
  @Input() users: User[];
  @Input() votes: GradeVote[];
  @Input() currentUser: User; */

  constructor(
    // private afs: AngularFirestore,
    // private router: Router
  ) { }

  /* canLockSongList(): boolean {
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
  }

  changeLockStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isLocked: status
    });
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }

  finishConstitution(): void {
    // this.results.sort(compareResultScoreDSC);
    // const winnerResult = this.results[0];

    this.afs.collection("history").add({
      season: this.constitution.season,
      round: this.constitution.round,
      name: this.constitution.name,
      ownerName: this.showDisplayName(this.constitution.owner),
      youtubePlaylistID: this.constitution.youtubePlaylistID,
      // winnerName: this.showDisplayName(winnerResult.userID),
      // winnerSongURL: winnerResult.url,
      // winnerSongTitle: winnerResult.title,
      // winnerSongAuthor: winnerResult.author
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
  } */

}
