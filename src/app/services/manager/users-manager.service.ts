import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/types/user';

@Injectable({
  providedIn: 'root'
})
export class UsersManagerService {

  private usersObservable: Observable<User[]>;
  public users: BehaviorSubject<User[]>;

  constructor(private afs: AngularFirestore) {
    this.usersObservable = this.afs.collection<User>('users').valueChanges();

    this.users = new BehaviorSubject(null);
    this.usersObservable.subscribe(this.users);
  }
}
