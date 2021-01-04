import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Song } from '../types/song';

@Injectable({
  providedIn: 'root'
})
export class SongListManagerService {

  private constitutionID: string;
  private songListObservable: Observable<Song[]>;
  songList: BehaviorSubject<Song[]>;
  
  constructor(private afs: AngularFirestore) { }

  init(constitutionID: string): void {
    this.constitutionID = constitutionID;
    
    this.songListObservable = this.afs.collection<Song>(`constitutions/${this.constitutionID}/songs`).valueChanges();
    
    this.songList = new BehaviorSubject([]);
    this.songListObservable.subscribe(this.songList);
  }
}
