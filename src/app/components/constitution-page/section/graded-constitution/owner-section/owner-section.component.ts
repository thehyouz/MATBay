import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../../../../types/user';
import { Constitution } from 'src/app/types/constitution';
import { GradeVote } from 'src/app/types/vote';
import { MathService } from 'src/app/services/math.service';
import { MatAccordion } from '@angular/material/expansion';
import { GradedConstitutionService } from 'src/app/services/constitution/graded-constitution.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public constitutionForm: FormGroup;
  private gradedConstitution: GradedConstitutionService;

  ngOnInit() {
    this.constitutionForm = this.fb.group({
      name: [this.constitution.name, Validators.required],
      youtubePlaylist: [this.constitution.youtubePlaylistID, Validators.required]
    })
    this.gradedConstitution = new GradedConstitutionService(this.math, this.afs, this.constitution, this.users, this.votes);
  }

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private math: MathService,
    private fb: FormBuilder
  ) {}

  updateConstitution(): void {
    this.constitution.name = this.constitutionForm.get('name').value;
    this.constitution.youtubePlaylistID = this.constitutionForm.get('youtubePlaylist').value;
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      name: this.constitution.name,
      youtubePlaylistID: this.constitution.youtubePlaylistID
    });
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
  }

  changeLockStatus(status: boolean): void {
    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      isLocked: status
    });
  }

  finishConstitution(): void {
    if (this.gradedConstitution.results === undefined) {
      this.gradedConstitution = new GradedConstitutionService(this.math, this.afs, this.constitution, this.users, this.votes);
    }

    // let winnerSong = this.constitution.songs.find(x => x.id === this.constitution.winnerSongID);
    // let winnerUser = this.users.find(x => x.uid === this.constitution.winnerUserID);

    let usernames: string[] = [];
    for (const user of this.users) {
      usernames.push(user.uid);
    }

    let songsTitle: string[] = [];
    let songsAuthor: string[] = [];
    let songsOwner: string[] = [];
    let songsURL: string[] = [];

    this.constitution.songs = this.gradedConstitution.sortByResults2(this.constitution.songs);

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

      winnerID: this.constitution.songs[0].patron,              // winnerUser.uid,
      winnerSongURL: this.constitution.songs[0].url,            // winnerSong.url,
      winnerSongTitle: this.constitution.songs[0].shortTitle,   // winnerSong.shortTitle,
      winnerSongAuthor: this.constitution.songs[0].author,      // winnerSong.author,

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
