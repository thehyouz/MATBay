import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { EMPTY_SONG, Song } from 'src/app/types/song';
import { SongPlatform } from 'src/app/types/song-platform.enum';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-manage-songs-window',
  templateUrl: './manage-songs-window.component.html',
  styleUrls: ['./manage-songs-window.component.scss']
})

export class ManageSongsWindowComponent {

  private currentUser: User;
  private constitution: Constitution;

  public newSongForm: FormGroup;
  public deleteSongForm: FormGroup;
  private newSongParameter: Song;

  constructor(private dialogRef: MatDialogRef<ManageSongsWindowComponent>,
              private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) data) {
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
      formSongId: new FormControl(),
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

  // TODO : Message Erreur
  addSong(): void {
    this.updateParameters();

    if(!this.isMissingParameters()) {
      let newId = 0;

      if (this.constitution.songs[this.constitution.songs.length -1]) {
        newId = this.constitution.songs[this.constitution.songs.length -1].id+1;
      }

      let newSong: Song = {
        id: newId,
        shortTitle: this.newSongParameter.shortTitle,
        platform: SongPlatform.Youtube,
        url: this.newSongParameter.url,
        patron: this.currentUser.uid,
        author: this.newSongParameter.author
      };
  
      this.constitution.songs.push(newSong);
      this.closeWindow();
    }
  }

  // TODO : Message Erreur
  deleteSong(): void {
    const id = this.deleteSongForm.value['formSongId'];
    if (id !== null) {
      const index = this.constitution.songs.findIndex(x => x.id == id);
      if (this.constitution.songs[index].patron === this.currentUser.uid) {
        this.constitution.songs.splice(index, 1);
        this.closeWindow();
      }
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
