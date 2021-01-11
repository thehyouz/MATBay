import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstitutionArchived } from 'src/app/types/constitution';

@Injectable({
  providedIn: 'root'
})
export class ConstitutionHistoryManagerService {

  private constitutionHistoryObservable: Observable<ConstitutionArchived[]>;
  public constitutions: BehaviorSubject<ConstitutionArchived[]>;

  constructor(private afs: AngularFirestore) { 
    this.constitutionHistoryObservable = this.afs.collection<ConstitutionArchived>('history/').valueChanges();

    this.constitutions = new BehaviorSubject(null);
    this.constitutionHistoryObservable.subscribe(this.constitutions);
  }
}
