import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstitutionType } from 'src/app/types/constitution';
import { GradeVote, RankVote } from '../../types/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteManagerService {

  private constitutionID: string;
  private votesObservable: Observable<GradeVote[] | RankVote[]>;
  votes: BehaviorSubject<GradeVote[] | RankVote[]>;

  constructor(private afs: AngularFirestore) { }

  init(constitutionID: string, constitutionType: number): void {
    this.constitutionID = constitutionID;

    switch (constitutionType) {
      case ConstitutionType.GRADE:
        this.votesObservable = this.afs.collection<GradeVote>(`constitutions/${this.constitutionID}/votes`).valueChanges();
        break;

      case ConstitutionType.RANK:
        this.votesObservable = this.afs.collection<RankVote>(`constitutions/${this.constitutionID}/votes`).valueChanges();
        break;
    }

    this.votes = new BehaviorSubject([]);
    this.votesObservable.subscribe(this.votes);
  }
}
