import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { GradeVote } from '../../types/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteManagerService {

  private constitutionID: string;
  private votesObservable: Observable<GradeVote[]>;
  votes: BehaviorSubject<GradeVote[]>;

  constructor(private afs: AngularFirestore) { }

  init(constitutionID: string): void {
    this.constitutionID = constitutionID;

    this.votesObservable = this.afs.collection<GradeVote>(`constitutions/${this.constitutionID}/votes`).valueChanges();

    this.votes = new BehaviorSubject([]);
    this.votesObservable.subscribe(this.votes);
  }
}
