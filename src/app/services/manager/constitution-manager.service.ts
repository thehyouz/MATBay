import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constitution } from '../../types/constitution';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConstitutionManagerService {

  private constitutionsObservable: Observable<Constitution[]>;
  public constitutions: BehaviorSubject<Constitution[]>;

  constructor(private afs: AngularFirestore) {
    this.constitutionsObservable = this.afs.collection<Constitution>('constitutions/').valueChanges();

    this.constitutions = new BehaviorSubject(null);
    this.constitutionsObservable.subscribe(this.constitutions);
  }  

}
