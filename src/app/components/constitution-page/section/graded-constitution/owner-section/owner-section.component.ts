import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../../../../types/user';
import { Constitution } from 'src/app/types/constitution';
import { GradeVote } from 'src/app/types/vote';
import { MathService } from 'src/app/services/math.service';
import { MatAccordion } from '@angular/material/expansion';
import { GradedConstitutionService } from 'src/app/services/constitution/graded-constitution.service';

@Component({
  selector: 'graded-owner-section',
  templateUrl: './owner-section.component.html',
  styleUrls: ['./owner-section.component.scss']
})
export class GradedOwnerSectionComponent implements OnInit {

  @Input() constitution: Constitution;
  @Input() users: User[];
  @Input() votes: GradeVote[];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  private gradedConstitution: GradedConstitutionService;

  ngOnInit() {
    this.gradedConstitution = new GradedConstitutionService(this.math, this.afs, this.constitution, this.users, this.votes);
  }

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private math: MathService,
  ) { }

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
  }

  changeLockStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isLocked: status
    });
  }

  finishConstitution(): void {
    if (this.constitution.winnerUserID === '' || this.constitution.winnerSongID === -1) {
      this.gradedConstitution = new GradedConstitutionService(this.math, this.afs, this.constitution, this.users, this.votes);
      this.gradedConstitution.calculateResults();
    }

    let winnerSong = this.constitution.songs.find(x => x.id === this.constitution.winnerSongID);
    let winnerUser = this.users.find(x => x.uid === this.constitution.winnerUserID);

    let usernames: string[] = [];
    for (const user of this.users) {
      usernames.push(user.uid);
    }

    let songsTitle: string[] = [];
    let songsAuthor: string[] = [];
    let songsOwner: string[] = [];
    let songsURL: string[] = [];

    for(const song of this.constitution.songs) {
      songsTitle.push(song.shortTitle);
      songsAuthor.push(song.author);
      songsURL.push(song.url);
      songsOwner.push(song.patron);
    }

    this.afs.collection("history").add({
      season: this.constitution.season,
      part: this.constitution.part,
      name: this.constitution.name,
      ownerID: this.constitution.owner,
      youtubePlaylistID: this.constitution.youtubePlaylistID,

      winnerID: winnerUser.uid,
      winnerSongURL: winnerSong.url,
      winnerSongTitle: winnerSong.shortTitle,
      winnerSongAuthor: winnerSong.author,

      usernames: usernames,
      songsTitle: songsTitle,
      songsOwner: songsOwner,
      songsAuthor: songsAuthor,
      songsURL: songsURL
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
