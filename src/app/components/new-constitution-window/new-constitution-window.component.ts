import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Constitution, ConstitutionType, EMPTY_CONSTITUTION, MAX_SONG_LIMIT, MAX_USER_LIMIT, MIN_USER_LIMIT } from 'src/app/types/constitution';
import { YOUTUBE_PLAYLIST_HEADER_LENGTH } from 'src/app/types/song-platform';
import { Status } from 'src/app/types/status';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-new-constitution-window',
  templateUrl: './new-constitution-window.component.html',
  styleUrls: ['./new-constitution-window.component.scss']
})
export class NewConstitutionWindowComponent {
  public currentUser: User;
  public currentStatus: Status;
  public formIsMissingParameters: boolean;

  public newConstitutionForm: FormGroup;
  private newConstitutionParameter: Constitution;

  public CONSTITUTION_TYPE: string[] = ["Note", "Classement"];
  public selectedType: string;

  constructor(private dialogRef: MatDialogRef<NewConstitutionWindowComponent>,
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
      formPart: new FormControl(),
      formName: new FormControl(),
      formIsPublic: new FormControl(),
      formYoutubePlaylist: new FormControl(),
      formNumberOfSongsPerUser: new FormControl(),
      formIsAnonymous: new FormControl(),
      formNumberMaxOfUser: new FormControl()
    });

    this.selectedType = this.CONSTITUTION_TYPE[0];
  }

  isMissingParameters(): boolean {
    const seasonIsMissing = (this.newConstitutionParameter.season === null);
    const partIsMissing = (this.newConstitutionParameter.part === null);
    const nameIsMissing = (this.newConstitutionParameter.name === null);
    const numberOfSongsPerUserIsMissing = (this.newConstitutionParameter.numberOfSongsPerUser === null);
    const numberMaxOfUserIsMissing = (this.newConstitutionParameter.numberMaxOfUser === null)

    return seasonIsMissing || partIsMissing || nameIsMissing || numberOfSongsPerUserIsMissing || numberMaxOfUserIsMissing;
  }

  parametersAreValid(): boolean {
    const numberMaxOfUserIsValid = (this.newConstitutionParameter.numberMaxOfUser <= MAX_USER_LIMIT) && (this.newConstitutionParameter.numberMaxOfUser >= MIN_USER_LIMIT);
    const numberOfSongsPerUserIsValid = (this.newConstitutionParameter.numberMaxOfUser * this.newConstitutionParameter.numberOfSongsPerUser <= MAX_SONG_LIMIT);
    return numberMaxOfUserIsValid && numberOfSongsPerUserIsValid;
  }

  updateParameters(): void {
    this.newConstitutionParameter.season = this.newConstitutionForm.value['formSeason'];
    this.newConstitutionParameter.part = this.newConstitutionForm.value['formPart'];
    this.newConstitutionParameter.name = this.newConstitutionForm.value['formName'];
    this.newConstitutionParameter.youtubePlaylistID = this.newConstitutionForm.value['formYoutubePlaylist'];
    if (this.newConstitutionParameter.youtubePlaylistID !== null) {
      this.newConstitutionParameter.youtubePlaylistID = this.newConstitutionParameter.youtubePlaylistID.slice(YOUTUBE_PLAYLIST_HEADER_LENGTH);
    }
    this.newConstitutionParameter.isPublic = this.newConstitutionForm.value['formIsPublic'];
    this.newConstitutionParameter.isAnonymous = this.newConstitutionForm.value['formIsAnonymous'];

    if (this.selectedType === this.CONSTITUTION_TYPE[1]) {
      this.newConstitutionParameter.numberOfSongsPerUser = 25;
      this.newConstitutionParameter.numberMaxOfUser = 4;
    } else {
      this.newConstitutionParameter.numberOfSongsPerUser = this.newConstitutionForm.value['formNumberOfSongsPerUser'];
      this.newConstitutionParameter.numberMaxOfUser = this.newConstitutionForm.value['formNumberMaxOfUser'];
    }

  }


  returnConstitutionTypeEnum(type: string): number {
    switch (type) {
      case this.CONSTITUTION_TYPE[0]: return ConstitutionType.GRADE;
      case this.CONSTITUTION_TYPE[1]: return ConstitutionType.RANK;
      default: return ConstitutionType.GRADE;
    }
  }

  async createNewConstitution(): Promise<void> {
    this.updateParameters();

    if (this.isMissingParameters()) {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Paramètre manquant";
    } else if (!this.parametersAreValid()) {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Valeurs limites du nombre d'utilisateurs (2 à 10) ou du nombre de chansons (100) ont été dépassés";
    } else {

      const newConstitutionID = this.afs.createId();

      let newConstitution: Constitution = {
        id: newConstitutionID,
        season:  this.newConstitutionParameter.season,
        part: this.newConstitutionParameter.part,
        name: this.newConstitutionParameter.name,
        isPublic: this.newConstitutionParameter.isPublic? this.newConstitutionParameter.isPublic : false,
        type: this.returnConstitutionTypeEnum(this.selectedType),
        isLocked: false,
        isShowingResult: false,
        round: 0,
        owner: this.currentUser.uid,
        winnerUserID: '',
        numberMaxOfUser: this.newConstitutionParameter.numberMaxOfUser,
        users: [this.currentUser.uid],
        isAnonymous: this.newConstitutionParameter.isAnonymous? this.newConstitutionParameter.isAnonymous : false,
        songs: [],
        winnerSongID: -1,
        youtubePlaylistID: this.newConstitutionParameter.youtubePlaylistID? this.newConstitutionParameter.youtubePlaylistID : "",
        numberOfSongsPerUser: this.newConstitutionParameter.numberOfSongsPerUser
      }

      this.afs.collection('constitutions/').doc(newConstitutionID).set({
        id: newConstitution.id,
        season:  newConstitution.season,
        part: newConstitution.part,
        name: newConstitution.name,
        isPublic: newConstitution.isPublic? newConstitution.isPublic : false,
        type: newConstitution.type,
        isLocked: newConstitution.isLocked,
        isShowingResult: newConstitution.isShowingResult,
        round: newConstitution.round,
        owner: this.currentUser.uid,
        winnerUserID: newConstitution.winnerUserID,
        numberMaxOfUser: newConstitution.numberMaxOfUser,
        users: [this.currentUser.uid],
        isAnonymous: newConstitution.isAnonymous? newConstitution.isAnonymous : false,
        songs: [],
        winnerSongID: newConstitution.winnerSongID,
        youtubePlaylistID: newConstitution.youtubePlaylistID? newConstitution.youtubePlaylistID : "",
        numberOfSongsPerUser: newConstitution.numberOfSongsPerUser
      });

      this.routing.addConstitutionRoute(newConstitution.id);

      this.closeWindow();
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
