import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Constitution } from 'src/app/types/constitution';

@Component({
  selector: 'app-new-constitution-window',
  templateUrl: './new-constitution-window.component.html',
  styleUrls: ['./new-constitution-window.component.scss']
})
export class NewConstitutionWindowComponent {

  public newConstitution: FormGroup;

  private constitutionSeason: number;
  private constitutionRound: number;
  private constitutionName: string;
  private constitutionIsPublic: boolean;
  private constitutionNumberOfSongs: number;
  private constitutionNumberOfSongPerUser: number;

  constructor(private dialogRef: MatDialogRef<NewConstitutionWindowComponent>) {
    this.newConstitution = new FormGroup({
      formSeason: new FormControl(this.constitutionSeason),
      formRound: new FormControl(this.constitutionRound),
      formName: new FormControl(this.constitutionName),
      formIsPublic: new FormControl(this.constitutionIsPublic),
      formNumberOfSongs: new FormControl(this.constitutionNumberOfSongs),
      formNumberOfSongsPerUser: new FormControl(this.constitutionNumberOfSongPerUser)
    })
  }

  createNewConstitution(): void {
    let newConstitution: Constitution = {
      season: this.constitutionSeason,
      round: this.constitutionRound,
      name: this.constitutionName,
      isPublic: this.constitutionIsPublic,
      president: null,
      winnerUser: null,
      users: null,
      songs: null,
      winnerSong: null,
      youtubePlaylistID: "",
      numberOfSongsPerUser: this.constitutionNumberOfSongPerUser,
      numberOfSongsMax: 100
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
