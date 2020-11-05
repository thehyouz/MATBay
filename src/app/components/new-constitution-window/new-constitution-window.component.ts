import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Constitution } from 'src/app/types/constitution';
import { Status } from 'src/app/types/status';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-new-constitution-window',
  templateUrl: './new-constitution-window.component.html',
  styleUrls: ['./new-constitution-window.component.scss']
})
export class NewConstitutionWindowComponent {

  private currentUser: User;
  public currentStatus: Status;
  public formIsMissingParameters: boolean;

  // Form
  public newConstitution: FormGroup;
  private constitutionSeason: number;
  private constitutionRound: number;
  private constitutionName: string;
  private constitutionIsPublic: boolean;
  private constitutionYoutubePlaylist: string;
  private constitutionNumberOfSongPerUser: number;

  constructor(private dialogRef: MatDialogRef<NewConstitutionWindowComponent>,
              private constitutionManager: ConstitutionManagerService,
              public auth: AuthService,
              private routing: RoutingService) {
    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    this.currentStatus = {
      error: false,
      hidden: true,
      message: ""
    }
    this.formIsMissingParameters = false;

    this.newConstitution = new FormGroup({
      formSeason: new FormControl(this.constitutionSeason),
      formRound: new FormControl(this.constitutionRound),
      formName: new FormControl(this.constitutionName),
      formIsPublic: new FormControl(this.constitutionIsPublic),
      formYoutubePlaylist: new FormControl(this.constitutionYoutubePlaylist),
      formNumberOfSongsPerUser: new FormControl(this.constitutionNumberOfSongPerUser)
    })
  }

  isMissingParameters(): boolean {
    const seasonIsMissing: boolean = (this.constitutionSeason === null);
    const roundIsMissing: boolean = (this.constitutionRound === null);
    const nameIsMissing: boolean = (this.constitutionName === null);
    const numberOfSongsPerUserIsMissing: boolean = (this.constitutionNumberOfSongPerUser === null);

    this.formIsMissingParameters = seasonIsMissing || roundIsMissing || nameIsMissing || numberOfSongsPerUserIsMissing;

    return this.formIsMissingParameters;
  }

  updateParameters(): void {
    this.constitutionSeason = this.newConstitution.value['formSeason'];
    this.constitutionRound = this.newConstitution.value['formRound'];
    this.constitutionName = this.newConstitution.value['formName'];
    this.constitutionIsPublic = this.newConstitution.value['formIsPublic'];
    this.constitutionYoutubePlaylist = this.newConstitution.value['formYoutubePlaylist'];
    this.constitutionNumberOfSongPerUser = this.newConstitution.value['formNumberOfSongsPerUser'];
  }

  createNewConstitution(): void {
    this.updateParameters();

    if (!this.isMissingParameters()) {
      let newConstitution: Constitution = {
        season: this.constitutionSeason,
        round: this.constitutionRound,
        name: this.constitutionName,
        isPublic: this.constitutionIsPublic,
        owner: this.currentUser.uid,
        winnerUserIndex: -1,
        users: [this.currentUser.uid],
        songs: [],
        winnerSongIndex: -1,
        youtubePlaylistID: this.constitutionYoutubePlaylist? this.constitutionYoutubePlaylist : "",
        numberOfSongsPerUser: this.constitutionNumberOfSongPerUser,
      }

      this.routing.addConstitutionRoute(this.constitutionName);

      this.constitutionManager.constitutions.push(newConstitution);
      this.closeWindow();
    } else {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Paramètre manquant";
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
