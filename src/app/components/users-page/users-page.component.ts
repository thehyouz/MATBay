import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  private users: User[];

  ngOnInit(): void {
    this.afs.collection("users/").get().toPromise().then(newUsers => {
      this.users = [];
      newUsers.forEach(async user => {
        this.users.push(user.data() as User);
      });
    });
  }

  constructor(private afs: AngularFirestore) {}

  array(n: number): any[] {
    return Array(n);
  }

  getUsers(): User[] {
    if (this.users === undefined) {
      return [];
    }
    return this.users;
  }

}
