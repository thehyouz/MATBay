import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-songs-window',
  templateUrl: './manage-songs-window.component.html',
  styleUrls: ['./manage-songs-window.component.scss']
})

export class ManageSongsWindowComponent {

  // Form
  public newSong: FormGroup;

  constructor(private dialogRef: MatDialogRef<ManageSongsWindowComponent>) { }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
