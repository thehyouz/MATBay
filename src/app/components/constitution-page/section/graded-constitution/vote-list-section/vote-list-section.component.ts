import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { EMPTY_GRADE_VOTE, GradeVote } from 'src/app/types/vote';
import { GradedSongWindowComponent } from './song-window/song-window.component';

@Component({
  selector: 'graded-vote-list-section',
  templateUrl: './vote-list-section.component.html',
  styleUrls: ['./vote-list-section.component.scss']
})
export class GradedVoteListSectionComponent  {
  @Input() constitution: Constitution;
  @Input() users: User[];
  @Input() votes: GradeVote[];
  @Input() currentUser: User;
  @Input() currentSection: CurrentSectionConstitution;

  private hideVotedSongs: boolean = false;

  constructor(private dialog: MatDialog) { }

  openDialogSong(song: Song): void {
    const dialogConfig = new MatDialogConfig;

    let vote = this.votes.find(voteIterator => (voteIterator.songID === song.id) && (voteIterator.userID === this.currentUser.uid));
    if (vote === undefined) { vote = EMPTY_GRADE_VOTE; }

    dialogConfig.data = {
      song: song,
      hideVotedSongs: this.hideVotedSongs,
      constitution: this.constitution,
      currentSection: this.currentSection,
      vote: vote,
      votes: this.votes
    }

    dialogConfig.hasBackdrop = true;
    dialogConfig.maxWidth = '80%';
    dialogConfig.maxHeight = '60%';

    this.dialog.open(GradedSongWindowComponent, dialogConfig);
  }

  getNumberOfVotesOfUser(): number {
    let count = 0;
    for (const vote of this.votes) {
      if (vote.userID === this.currentUser.uid) {
        count++;
      }
    }
    return count;
  }

  onChange(event: MatCheckboxChange){
    this.hideVotedSongs = event.checked;
  }

  sortDataSong(sort: Sort) {
    const data = this.constitution.songs.slice();
    if(!sort.active || sort.direction === '') {
      this.constitution.songs = data;
      return;
    }

    this.constitution.songs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case "id": return this.compare(a.id, b.id, isAsc);
        case "title": return this.compare(a.shortTitle, b.shortTitle, isAsc);
        case "username": return this.compare(this.showDisplayName(a.patron), this.showDisplayName(b.patron), isAsc);
        case "grade": return this.compare(this.returnVote(a)+1, this.returnVote(b)+1, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  returnVote(song: Song): number {
    const vote = this.votes.find(voteIterator => (voteIterator.songID === song.id) && (voteIterator.userID === this.currentUser.uid));
    if (vote !== undefined) {
      return vote.grade;
    }
    return -1;
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
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
