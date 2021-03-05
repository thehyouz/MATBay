import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";

import { User } from "src/app/types/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userObservable: Observable<User>;
  user$: BehaviorSubject<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get the auth state, then fetch the FireDatabase user file or return null
    this.userObservable = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // user is defined, so we are logged in!
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // user is null, meaning we are not logged in.
          return of(null);
        }
      })
    );
    this.user$ = new BehaviorSubject(null);
    this.userObservable.subscribe(this.user$);
  }

  public updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAuthorized: user.isAuthorized,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    return userRef.set(data, { merge: true });
  }

  async googleSignIn(): Promise<void> {
    const provider: auth.GoogleAuthProvider = new auth.GoogleAuthProvider();
    const credentials: auth.UserCredential = await this.afAuth.signInWithPopup(provider);
    const newUser: User = {
      ...credentials.user,
      isAuthorized: [false, false],
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(`users/${newUser.uid}`);
    userRef.get().subscribe(doc => {
      // user already has an account in the database
      if (doc.exists) return;
      return this.updateUserData(newUser);
    }, (err) => console.log("Sorry, a fatal error occured during login:", err))
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
