import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';

@Component({
  selector: 'app-song-window',
  templateUrl: './song-window.component.html',
  styleUrls: ['./song-window.component.scss']
})
export class SongWindowComponent {

  song: Song;
  constitution: Constitution;

  constructor(private dialogRef: MatDialogRef<SongWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.song = data.song;
    this.constitution = data.constitution;
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
