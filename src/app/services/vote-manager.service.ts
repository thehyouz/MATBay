import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { VoteSOC } from '../types/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteManagerService {

  private constitutionID: string;
  private votesObservable: Observable<VoteSOC[]>;
  votes: BehaviorSubject<VoteSOC[]>;

  constructor(private afs: AngularFirestore) { }

  init(constitutionID: string): void {
    this.constitutionID = constitutionID;

    this.votesObservable = this.afs.collection<VoteSOC>(`constitutions/${this.constitutionID}/votes`).valueChanges();

    this.votes = new BehaviorSubject([]);
    this.votesObservable.subscribe(this.votes);
  }
}
