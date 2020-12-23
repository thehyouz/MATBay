import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { EMPTY_SONG, Song } from 'src/app/types/song';
import { SongPlatform } from 'src/app/types/song-platform.enum';
import { Status } from 'src/app/types/status';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-manage-songs-window',
  templateUrl: './manage-songs-window.component.html',
  styleUrls: ['./manage-songs-window.component.scss']
})
export class ManageSongsWindowComponent {

  public currentStatusAdd: Status;
  public currentStatusDelete: Status;
  private currentUser: User;
  private constitution: Constitution;

  public newSongForm: FormGroup;
  public deleteSongForm: FormGroup;
  private newSongParameter: Song;

  constructor(private dialogRef: MatDialogRef<ManageSongsWindowComponent>,
              private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) data,
              public afs: AngularFirestore) {
    this.currentStatusAdd = {
      error: false,
      hidden: true,
      message: ""
    }
    this.currentStatusDelete = {
      error: false,
      hidden: true,
      message: ""
    }
    this.newSongParameter = EMPTY_SONG;

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    this.constitution = data.constitution;

    this.newSongForm = new FormGroup({
      formShortTitle: new FormControl(),
      formAuthor: new FormControl(),
      formUrl: new FormControl()
    });

    this.deleteSongForm = new FormGroup({
      formSongConstitutionNumber: new FormControl(),
    })
  }

  isMissingParameters(): boolean {
    const titleIsMissing: boolean = (this.newSongParameter.shortTitle === null);
    const authorIsMissing: boolean = (this.newSongParameter.author === null);
    const urlIsMissing: boolean = (this.newSongParameter.url === null);

    return titleIsMissing || authorIsMissing || urlIsMissing;
  }

  updateParameters(): void {
    this.newSongParameter.shortTitle = this.newSongForm.value['formShortTitle'];
    this.newSongParameter.author = this.newSongForm.value['formAuthor'];
    this.newSongParameter.url = this.newSongForm.value['formUrl'];
  }

  numberOfSongsOfUser(uid: string): number {
    let i = 0;
    for (const song of this.constitution.songs) {
      if (song.patron == uid) {
        i++;
      }
    }
    return i;
  }

  addSong(): void {
    if(this.numberOfSongsOfUser(this.currentUser.uid) >= this.constitution.numberOfSongsPerUser) {
      this.currentStatusAdd.error = true;
      this.currentStatusAdd.message = "Erreur : Vous avez atteint votre nombre max de chanson";
    } else {
      this.updateParameters();
      if(!this.isMissingParameters()) {
        let newConstitutionNumber = 0;

        if (this.constitution.songs[this.constitution.songs.length -1]) {
          newConstitutionNumber = this.constitution.songs[this.constitution.songs.length -1].constitutionNumber+1;
        }

        const newSongID = this.afs.createId();

        let newSong: Song = {
          id: newSongID,
          constitutionNumber: newConstitutionNumber,
          shortTitle: this.newSongParameter.shortTitle,
          platform: SongPlatform.Youtube,
          url: this.newSongParameter.url,
          patron: this.currentUser.uid,
          author: this.newSongParameter.author
        };

        this.afs.collection('constitutions').doc(this.constitution.id).collection('/songs').doc(newSongID).set({
          id: newSong.id,
          constitutionNumber: newSong.constitutionNumber,
          shortTitle: newSong.shortTitle,
          platform: newSong.platform,
          url: newSong.url,
          patron: newSong.patron,
          author: newSong.author
        })
    
        this.constitution.songs.push(newSong);
        this.closeWindow();
      } else {
        this.currentStatusAdd.error = true;
        this.currentStatusAdd.message = "Erreur : Paramètre manquant";
      }
    }
  }

  deleteSong(): void {
    const constitutionNumber = this.deleteSongForm.value['formSongConstitutionNumber'];
    if (constitutionNumber !== null) {
      const index = this.constitution.songs.findIndex(x => x.constitutionNumber == constitutionNumber);
      if (index === -1) {
        this.currentStatusDelete.error = true;
        this.currentStatusDelete.message = "Erreur : La chanson n'existe pas";
      }
      else if (this.constitution.songs[index].patron === this.currentUser.uid) {
        this.constitution.songs.splice(index, 1);
        this.closeWindow();
      } else {
        this.currentStatusDelete.error = true;
        this.currentStatusDelete.message = "Erreur : La chanson ne vous appartient pas";
      }
    } else {
      this.currentStatusDelete.error = true;
      this.currentStatusDelete.message = "Erreur : Paramètre manquant";
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
