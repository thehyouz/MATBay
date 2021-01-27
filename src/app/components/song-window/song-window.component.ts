import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { SongPlatform, YOUTUBE_HEADER_LENGTH } from 'src/app/types/song-platform';

@Component({
  selector: 'app-song-window',
  templateUrl: './song-window.component.html',
  styleUrls: ['./song-window.component.scss'],
})

export class SongWindowComponent {
  public song: Song;
  private constitution: Constitution;
  public safeUrl: SafeResourceUrl;

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

  previousSongExist(): boolean {
    const index = this.constitution.songs.findIndex(x => x.id === this.song.id);
    return index - 1 >= 0;
  }

  nextSongExist(): boolean {
    const index = this.constitution.songs.findIndex(x => x.id === this.song.id);
    return index + 1 < this.constitution.songs.length;
  }

  changeSong(shift: number): void {
    const currentIndex = this.constitution.songs.findIndex(x => x.id === this.song.id);

    this.song = this.constitution.songs[currentIndex + shift];
    this.safeUrl = this.makeSafeURL();
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
