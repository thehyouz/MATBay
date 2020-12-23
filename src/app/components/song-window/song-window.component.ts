import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { SongPlatform } from 'src/app/types/song-platform.enum';

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

  constructor(private dialogRef: MatDialogRef<SongWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private sanitizer: DomSanitizer) {
    this.song = data.song;
    this.constitution = data.constitution;

    this.safeUrl = this.makeSafeURL();
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
