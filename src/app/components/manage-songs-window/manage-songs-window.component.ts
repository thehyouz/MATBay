import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SongListManagerService } from 'src/app/services/manager/song-list-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { compareSongIdASC, EMPTY_SONG, Song } from 'src/app/types/song';
import { SongPlatform } from 'src/app/types/song-platform';
import { Status } from 'src/app/types/status';
import { User } from 'src/app/types/user';
import { GradeVote } from 'src/app/types/vote';

@Component({
  selector: 'app-manage-songs-window',
  templateUrl: './manage-songs-window.component.html',
  styleUrls: ['./manage-songs-window.component.scss']
})
export class ManageSongsWindowComponent implements OnInit {
  public currentStatusAdd: Status;
  public currentStatusDelete: Status;
  private currentUser: User;
  private constitution: Constitution;

  public newSongForm: FormGroup;
  private newSongParameter: Song;

  private votes: GradeVote[];

  ngOnInit() {    
    this.songManager.init(this.constitution.id);
    this.constitution.songs = this.songManager.songList.getValue();

    this.songManager.songList.subscribe(newSongs => {
      this.constitution.songs = [];
      newSongs.forEach(async song => {
        this.constitution.songs.push(song);
      });
      this.constitution.songs.sort(compareSongIdASC);
    });
  }

  constructor(private dialogRef: MatDialogRef<ManageSongsWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              public afs: AngularFirestore,
              private songManager: SongListManagerService) {
    this.currentStatusAdd = {
      error: false,
      hidden: true,
      message: ""
    }
    this.newSongParameter = EMPTY_SONG;

    this.constitution = data.constitution;
    this.votes = data.votes;
    this.currentUser = data.currentUser;

    this.newSongForm = new FormGroup({
      formShortTitle: new FormControl(),
      formAuthor: new FormControl(),
      formUrl: new FormControl()
    });
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

  getUserSongs(): Song[] {
    const songs: Song[] = [];
    for (const song of this.constitution.songs) {
      if (song.patron === this.currentUser.uid) {
        songs.push(song);
      }
    }
    return songs;
  }

  addSong(): void {
    if (!this.constitution.isLocked) {
      if(this.numberOfSongsOfUser(this.currentUser.uid) >= this.constitution.numberOfSongsPerUser) {
        this.currentStatusAdd.error = true;
        this.currentStatusAdd.message = "Erreur : Vous avez atteint votre nombre max de chanson";
      } else {
        this.updateParameters();
        if(!this.isMissingParameters()) {
          
          let idMax = 0;
          for (const song of this.constitution.songs) {
            if (song.id > idMax) {
              idMax = song.id;
            }
          }

          idMax++;
  
          let newSong: Song = {
            id: idMax,
            shortTitle: this.newSongParameter.shortTitle,
            platform: SongPlatform.Youtube,
            url: this.newSongParameter.url,
            patron: this.currentUser.uid,
            author: this.newSongParameter.author
          };
  
          this.afs.collection('constitutions').doc(this.constitution.id).collection('/songs').doc(idMax.toString()).set({
            id: newSong.id,
            shortTitle: newSong.shortTitle,
            platform: newSong.platform,
            url: newSong.url,
            patron: newSong.patron,
            author: newSong.author
          })
      
          this.constitution.songs.push(newSong);
          this.newSongForm.reset();
        } else {
          this.currentStatusAdd.error = true;
          this.currentStatusAdd.message = "Erreur : Paramètre manquant";
        }
      }
    } else {
      this.currentStatusAdd.error = true;
      this.currentStatusAdd.message = "Erreur : La constitution est verrouillée, vous ne pouvez pas ajouter de chansons";
    }
  }

  deleteSongClick(song: Song): void {
    if (!this.constitution.isLocked) {
      this.afs.collection('constitutions').doc(this.constitution.id).collection('/songs').doc(song.id.toString()).delete();
      if (this.votes !== [] || this.votes !== undefined) {
        try {
          for (const vote of this.votes) {
            if (vote.songID === song.id) {
              this.afs.collection('constitutions').doc(this.constitution.id).collection('/votes').doc(vote.id).delete();
            }
          }
        } catch (error) {}
      }
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
