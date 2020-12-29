import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constitution } from '../types/constitution';

import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../types/song';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})

export class ConstitutionManagerService {

  private constitutionsObservable: Observable<Constitution[]>;
  constitutions: BehaviorSubject<Constitution[]>;

  constructor(private afs: AngularFirestore) {
    this.constitutionsObservable = this.afs.collection<Constitution>('constitutions/').valueChanges();

    this.constitutions = new BehaviorSubject(null);
    this.constitutionsObservable.subscribe(this.constitutions);
  }  

}

@Injectable({
  providedIn: 'root'
})

export class ConstitutionSongManagerService {

  private constitutionSongsObservable: Observable<Song[]>;
  songs: BehaviorSubject<Song[]>;

  constructor(private afs: AngularFirestore) {}

  generateObserver(constitutionID: string): void {
    this.constitutionSongsObservable = this.afs.collection<Constitution>('constitution/').doc<Constitution>(constitutionID).collection<Song>('songs/').valueChanges();

    this.songs = new BehaviorSubject(null);
    this.constitutionSongsObservable.subscribe(this.songs);
  }

}

@Injectable({
  providedIn: 'root'
})

export class ConstitutionUserManagerService {
  private constitutionUsersObservable: Observable<User[]>;
  users: BehaviorSubject<User[]>;

  constructor(private afs: AngularFirestore) {
    this.constitutionUsersObservable = this.afs.collection<User>('users').valueChanges();

    this.users = new BehaviorSubject(null);
    this.constitutionUsersObservable.subscribe(this.users);
  }

}