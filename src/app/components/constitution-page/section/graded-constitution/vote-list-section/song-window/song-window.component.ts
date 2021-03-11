import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { SongPlatform, YOUTUBE_HEADER_LENGTH } from 'src/app/types/song-platform';
import { User } from 'src/app/types/user';
import { EMPTY_GRADE_VOTE, GradeVote } from 'src/app/types/vote';

@Component({
  selector: 'graded-song-window',
  templateUrl: './song-window.component.html',
  styleUrls: ['./song-window.component.scss']
})

export class GradedSongWindowComponent {
  public song: Song;
  private constitution: Constitution;
  private votes: GradeVote[];
  public safeUrl: SafeResourceUrl;

  private hideVotedSongs = false;

  private vote: GradeVote;
  public currentUser: User;

  constructor(private dialogRef: MatDialogRef<GradedSongWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private sanitizer: DomSanitizer,
              public auth: AuthService,
              private afs: AngularFirestore) {
    this.song = data.song;
    this.constitution = data.constitution;
    this.vote = data.vote;
    this.votes = data.votes;
    this.hideVotedSongs = data.hideVotedSongs;

    this.safeUrl = this.makeSafeURL();

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    if (this.vote.songID === -1) {
      this.vote.grade = -1;
    }
  }

  array(n: number): any[] {
    return Array(n);
  }

  makeSafeURL(): SafeResourceUrl {
    if (this.song.platform == SongPlatform.Youtube) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.song.url.slice(YOUTUBE_HEADER_LENGTH));
    }
    return "";
  }

  previousSongExist(): boolean {
    const index = this.getUserSongToVote().findIndex(x => x.id === this.song.id);
    return index - 1 >= 0;
  }

  nextSongExist(): boolean {
    const index = this.getUserSongToVote().findIndex(x => x.id === this.song.id);
    return index + 1 < this.getUserSongToVote().length;
  }

  updateGrade(newGrade: number): void {
    this.afs.doc(`/constitutions/${this.constitution.id}/songs/${this.song.id}`).get().toPromise().then(doc => {
      if (!doc.exists) return;

      this.vote.grade = newGrade;

      if (this.vote.id === "") {
        const newID = this.afs.createId();

        this.vote = {
          id: newID,
          userID: this.currentUser.uid,
          songID: this.song.id,
          grade: newGrade
        }

        this.afs.collection('constitutions').doc(this.constitution.id).collection('votes').doc(newID).set({
          id: this.vote.id,
          userID: this.vote.userID,
          songID: this.vote.songID,
          grade: this.vote.grade
        });

        this.votes.push(this.vote);

      } else {
        this.afs.collection('constitutions').doc(this.constitution.id).collection('votes').doc(this.vote.id).update({
          grade: newGrade
        });
      }
    })
  }

  changeSong(shift: number): void {
    const currentIndex = this.getUserSongToVote().findIndex(x => x.id === this.song.id);

    this.song = this.getUserSongToVote()[currentIndex + shift];
    this.vote = this.votes.find(x => x.userID === this.currentUser.uid && x.songID === this.song.id);
    
    if (this.vote === undefined) {
      this.vote = EMPTY_GRADE_VOTE;
    }

    if (this.vote.songID === -1) {
      this.vote.grade = -1;
    }
    this.safeUrl = this.makeSafeURL();
  }

  isSelected(number: number): boolean {
    return number === this.vote.grade;
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

  returnVote(song: Song): number {
    const vote = this.votes.find(voteIterator => (voteIterator.songID === song.id) && (voteIterator.userID === this.currentUser.uid));
    if (vote !== undefined) {
      return vote.grade;
    }
    return -1;
  }

  getUserSongToVote(): Song[] {
    const songs: Song[] = []
    for (const song of this.constitution.songs) {
      if (song.patron !== this.currentUser.uid) {
        if (this.hideVotedSongs) {
          if (this.returnVote(song) === -1) {
            songs.push(song);
          }
        } else {
          songs.push(song);
        }
      }
    }
    return songs;
  }
}
