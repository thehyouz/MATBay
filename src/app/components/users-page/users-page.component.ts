import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { UsersManagerService } from 'src/app/services/manager/users-manager.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  public isUserLoading: boolean = true;
  public isUsersLoading: boolean = true;

  public users: User[];
  public currentUser: User;

  ngOnInit(): void {
    this.users = this.usersManager.users.getValue();
    this.usersManager.users.subscribe(newUsers => {
      this.users = newUsers;
      if (newUsers) {this.isUsersLoading = false;}
    })

    this.currentUser = this.auth.user$.getValue();
    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {this.isUserLoading = false;} 
    });
  }

  constructor(private afs: AngularFirestore,
              private auth: AuthService,
              private usersManager: UsersManagerService) {}

  canPromote(user: User): boolean {
    const isDev = this.currentUser.isAuthorized[1] === true;
    const userIsNotPromoted = user.isAuthorized[0] === false;
    return isDev && userIsNotPromoted;
  }

  promoteUser(user: User): void {
    this.afs.collection("users/").doc(user.uid).update({
      isAuthorized: [true, false]
    });
  }

  canUnpromote(user: User): boolean {
    const isDev = this.currentUser.isAuthorized[1] === true;
    const userIsPromoted = user.isAuthorized[0] === true;
    const userIsNotDev = user.isAuthorized[1] === false;
    return isDev && userIsPromoted && userIsNotDev;
  }

  unpromoteUser(user: User): void {
    this.afs.collection("users/").doc(user.uid).update({
      isAuthorized: [false, false]
    });
  }

}
