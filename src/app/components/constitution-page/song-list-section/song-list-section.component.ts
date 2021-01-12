import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { EMPTY_GRADE_VOTE, GradeVote } from 'src/app/types/vote';
import { SongWindowComponent } from '../../song-window/song-window.component';

@Component({
  selector: 'app-song-list-section',
  templateUrl: './song-list-section.component.html',
  styleUrls: ['./song-list-section.component.scss']
})
export class SongListSectionComponent {
  @Input() constitution: Constitution;
  @Input() users: User[];
  @Input() votes: GradeVote[];
  @Input() currentUser: User;
  @Input() currentSection: CurrentSectionConstitution

  constructor(private dialog: MatDialog) {}

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

    dialogConfig.hasBackdrop = true;
    dialogConfig.maxWidth = '80%';
    dialogConfig.maxHeight = '60%';

    this.dialog.open(SongWindowComponent, dialogConfig);
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
        case "author": return this.compare(a.author, b.author, isAsc);
        case "username": return this.compare(this.showDisplayName(a.patron), this.showDisplayName(b.patron), isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }
  
}
