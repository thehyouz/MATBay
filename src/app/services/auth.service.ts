import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

import { Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";

import { User } from "src/app/types/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get the auth state, then fetch the FireDatabase user file or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // user is defined, so we are logged in!
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // user is null, meaning we are not logged in.
          return of(null);
        }
      })
    )
  }

  private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true });
  }

  async googleSignIn(): Promise<void> {
    const provider: auth.GoogleAuthProvider = new auth.GoogleAuthProvider();
    const credentials: auth.UserCredential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credentials.user)
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
