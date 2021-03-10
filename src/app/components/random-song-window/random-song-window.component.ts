import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MathService } from 'src/app/services/math.service';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { SongPlatform, YOUTUBE_VIDEO_ID_LENGHT } from 'src/app/types/song-platform';

@Component({
  selector: 'app-random-song-window',
  templateUrl: './random-song-window.component.html',
  styleUrls: ['./random-song-window.component.scss']
})
export class RandomSongWindowComponent  {

  public song: Song;
  private constitution: Constitution;
  public safeUrl: SafeResourceUrl;

  constructor(private dialogRef: MatDialogRef<RandomSongWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private sanitizer: DomSanitizer,
              private math: MathService) {
    this.constitution = data.constitution;

    this.chooseRandomSong();

    this.safeUrl = this.makeSafeURL();
  }

  chooseRandomSong(): void {
    this.song = this.constitution.songs[this.math.random(0, this.constitution.songs.length - 1)];
    this.safeUrl = this.makeSafeURL();

  }

  makeSafeURL(): SafeResourceUrl {
    if (this.song.platform == SongPlatform.Youtube) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.song.url.slice(-YOUTUBE_VIDEO_ID_LENGHT));
    }
    return "";
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
