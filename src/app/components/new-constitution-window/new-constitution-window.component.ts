import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { EMPTY_SONG } from 'src/app/types/song';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-new-constitution-window',
  templateUrl: './new-constitution-window.component.html',
  styleUrls: ['./new-constitution-window.component.scss']
})
export class NewConstitutionWindowComponent {

  private currentUser: User;

  public newConstitution: FormGroup;

  private constitutionSeason: number;
  private constitutionRound: number;
  private constitutionName: string;
  private constitutionIsPublic: boolean;
  private constitutionNumberOfSongs: number;
  private constitutionNumberOfSongPerUser: number;

  constructor(private dialogRef: MatDialogRef<NewConstitutionWindowComponent>,
              private constitutionManager: ConstitutionManagerService,
              public auth: AuthService) {
    this.currentUser = auth.user$.getValue();           
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    this.newConstitution = new FormGroup({
      formSeason: new FormControl(this.constitutionSeason),
      formRound: new FormControl(this.constitutionRound),
      formName: new FormControl(this.constitutionName),
      formIsPublic: new FormControl(this.constitutionIsPublic),
      formNumberOfSongs: new FormControl(this.constitutionNumberOfSongs),
      formNumberOfSongsPerUser: new FormControl(this.constitutionNumberOfSongPerUser)
    })
  }

  updateParameter(): void {
    this.constitutionSeason = this.newConstitution.value['formSeason'];
    this.constitutionRound = this.newConstitution.value['formRound'];
    this.constitutionName = this.newConstitution.value['formName'];
    this.constitutionIsPublic = this.newConstitution.value['formIsPublic'];
    this.constitutionNumberOfSongPerUser = this.newConstitution.value['formNumberOfSongsPerUser'];
  }

  createNewConstitution(): void {
    this.updateParameter();
    let newConstitution: Constitution = {
      season: this.constitutionSeason,
      round: this.constitutionRound,
      name: this.constitutionName,
      isPublic: this.constitutionIsPublic,
      president: this.currentUser,
      winnerUser: null,
      users: [this.currentUser],
      songs: [],
      winnerSong: EMPTY_SONG,
      youtubePlaylistID: "",
      numberOfSongsPerUser: this.constitutionNumberOfSongPerUser,
      numberOfSongsMax: 100
    }
    // console.log(this.constitutionManager.constitutions);
    this.constitutionManager.constitutions.push(newConstitution);
    this.closeWindow();
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
