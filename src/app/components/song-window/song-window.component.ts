import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { CurrentSectionConstitution } from 'src/app/types/current-section.enum';
import { Song } from 'src/app/types/song';
import { SongPlatform } from 'src/app/types/song-platform.enum';
import { User } from 'src/app/types/user';

const YOUTUBE_HEADER_LENGTH = 32;

@Component({
  selector: 'app-song-window',
  templateUrl: './song-window.component.html',
  styleUrls: ['./song-window.component.scss']
})

export class SongWindowComponent {
  song: Song;
  constitution: Constitution;
  safeUrl: SafeResourceUrl;

  grade: number;

  currentUser: User;
  currentSection: number;

  constructor(private dialogRef: MatDialogRef<SongWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private sanitizer: DomSanitizer,
              public auth: AuthService) {
    this.song = data.song;
    this.constitution = data.constitution;
    this.currentSection = data.currentSection;

    this.safeUrl = this.makeSafeURL();

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);
  }

  array(n: number): any[] {
    return Array(n);
  }

  makeSafeURL(): SafeResourceUrl {
    if (this.song.platform == SongPlatform.Youtube) {
      console.log("Make safe URL");
      console.log(this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.song.url.slice(YOUTUBE_HEADER_LENGTH)));
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.song.url.slice(YOUTUBE_HEADER_LENGTH));
    }
    return "";
  }

  canVote(): boolean {
    const isUserThePatron = (this.song.patron == this.currentUser.uid);
    const isInVoteMode = (this.currentSection == CurrentSectionConstitution.Vote);
    return !isUserThePatron && isInVoteMode;
  }

  updateGrade(newGrade: number): void {
    this.grade = newGrade;
  }

  isSelected(number: number): boolean {
    return number == this.grade;
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
