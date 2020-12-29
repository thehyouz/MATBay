import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Constitution } from '../types/constitution';

import { BehaviorSubject, Observable, of } from 'rxjs';

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
