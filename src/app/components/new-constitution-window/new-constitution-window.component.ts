import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
// import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Constitution, EMPTY_CONSTITUTION, MAX_SONG_LIMIT, MAX_USER_LIMIT, MIN_USER_LIMIT } from 'src/app/types/constitution';
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

  public newConstitutionForm: FormGroup;
  private newConstitutionParameter: Constitution;

  constructor(private dialogRef: MatDialogRef<NewConstitutionWindowComponent>,
              // private constitutionManager: ConstitutionManagerService,
              public auth: AuthService,
              private routing: RoutingService,
              public afs: AngularFirestore) {
    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    this.currentStatus = {
      error: false,
      hidden: true,
      message: ""
    }

    this.newConstitutionParameter = EMPTY_CONSTITUTION;
    this.formIsMissingParameters = false;

    this.newConstitutionForm = new FormGroup({
      formSeason: new FormControl(),
      formRound: new FormControl(),
      formName: new FormControl(),
      formIsPublic: new FormControl(),
      formYoutubePlaylist: new FormControl(),
      formNumberOfSongsPerUser: new FormControl(),
      formIsAnonymous: new FormControl(),
      formNumberMaxOfUser: new FormControl()
    })
  }

  isMissingParameters(): boolean {
    const seasonIsMissing = (this.newConstitutionParameter.season === null);
    const roundIsMissing = (this.newConstitutionParameter.round === null);
    const nameIsMissing = (this.newConstitutionParameter.name === null);
    const numberOfSongsPerUserIsMissing = (this.newConstitutionParameter.numberOfSongsPerUser === null);
    const numberMaxOfUserIsMissing = (this.newConstitutionParameter.numberMaxOfUser === null)

    return seasonIsMissing || roundIsMissing || nameIsMissing || numberOfSongsPerUserIsMissing || numberMaxOfUserIsMissing;
  }


  parametersAreValid(): boolean {
    const numberMaxOfUserIsValid = (this.newConstitutionParameter.numberMaxOfUser <= MAX_USER_LIMIT) && (this.newConstitutionParameter.numberMaxOfUser >= MIN_USER_LIMIT);
    const numberOfSongsPerUserIsValid = (this.newConstitutionParameter.numberMaxOfUser * this.newConstitutionParameter.numberOfSongsPerUser <= MAX_SONG_LIMIT);
    return numberMaxOfUserIsValid && numberOfSongsPerUserIsValid;
  }

  updateParameters(): void {
    this.newConstitutionParameter.season = this.newConstitutionForm.value['formSeason'];
    this.newConstitutionParameter.round = this.newConstitutionForm.value['formRound'];
    this.newConstitutionParameter.name = this.newConstitutionForm.value['formName'];
    this.newConstitutionParameter.isPublic = this.newConstitutionForm.value['formIsPublic'];
    this.newConstitutionParameter.youtubePlaylistID = this.newConstitutionForm.value['formYoutubePlaylist'];
    this.newConstitutionParameter.numberOfSongsPerUser = this.newConstitutionForm.value['formNumberOfSongsPerUser'];
    this.newConstitutionParameter.isAnonymous = this.newConstitutionForm.value['formIsAnonymous'];
    this.newConstitutionParameter.numberMaxOfUser = this.newConstitutionForm.value['formNumberMaxOfUser'];
  }

  async createNewConstitution(): Promise<void> {
    this.updateParameters();

    console.log(this.newConstitutionParameter);

    if (this.isMissingParameters()) {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Paramètre manquant";
    } else if (!this.parametersAreValid()) {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Valeurs limites du nombre d'utilisteur (4 à 10) ou du nombre de chansons (100) ont été dépassés";
    } else {
      const newConstitution = await this.afs.collection('constitutions/').add({})

      this.afs.collection('constitutions/').doc(newConstitution.id).set({
        id: newConstitution.id,
        season:  this.newConstitutionParameter.season,
        round: this.newConstitutionParameter.round,
        name: this.newConstitutionParameter.name,
        isPublic: this.newConstitutionParameter.isPublic? this.newConstitutionParameter.isPublic : false,
        owner: this.currentUser.uid,
        winnerUserIndex: -1,
        numberMaxOfUser: this.newConstitutionParameter.numberMaxOfUser,
        users: [this.currentUser.uid],
        isAnonymous: this.newConstitutionParameter.isAnonymous? this.newConstitutionParameter.isAnonymous : false,
        songs: [],
        winnerSongIndex: -1,
        youtubePlaylistID: this.newConstitutionParameter.youtubePlaylistID? this.newConstitutionParameter.youtubePlaylistID : "",
        numberOfSongsPerUser: this.newConstitutionParameter.numberOfSongsPerUser
      });

      this.routing.addConstitutionRoute(newConstitution.id);
      // this.constitutionManager.constitutions.push(newConstitution);

      this.closeWindow();
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
