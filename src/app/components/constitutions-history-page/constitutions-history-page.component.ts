import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConstitutionHistoryManagerService } from 'src/app/services/manager/constitution-history-manager.service';
import { compareConstitutionASC, ConstitutionArchived } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';
import { ConstitutionHistoryDetailsWindowComponent } from '../constitution-history-details-window/constitution-history-details-window.component';

@Component({
  selector: 'app-constitutions-history-page',
  templateUrl: './constitutions-history-page.component.html',
  styleUrls: ['./constitutions-history-page.component.scss']
})
export class ConstitutionsHistoryPageComponent implements OnInit {

  public constitutions: ConstitutionArchived[];
  public areConstitutionsLoading: boolean = true;
  private users: User[];

  ngOnInit(): void {
    // get all users
    this.afs.collection("users/").get().toPromise().then(newUsers => {
      this.users = [];
      newUsers.forEach(async user => {
        this.users.push(user.data() as User);
      });
    });
    // update history
    this.constitutions = this.constitutionsHistoryManager.constitutions.getValue();
    this.constitutionsHistoryManager.constitutions.subscribe(newList => {
      this.constitutions = newList;
      if (newList) {
        this.areConstitutionsLoading = false;
        this.constitutions.sort(compareConstitutionASC);
      }
    });
  }

  constructor(private constitutionsHistoryManager: ConstitutionHistoryManagerService,
              private dialog: MatDialog,
              private afs: AngularFirestore) {}

  openDialogDetail(constitution: ConstitutionArchived) {
    const dialogConfig = new MatDialogConfig;

    const constitutionUsers: User[] = [];
    for (const user of this.users) {
      if (constitution.usernames.find(x => x === user.uid)) {
        constitutionUsers.push(user);
      }
      if (constitution.usernames.length === constitutionUsers.length) {
        break;
      }
    }

    dialogConfig.data = {
      constitution: constitution,
      users: constitutionUsers
    }
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '30%';

    this.dialog.open(ConstitutionHistoryDetailsWindowComponent, dialogConfig);
  }

  showDisplayName(uid: string): string {
    let name = ""
    if (this.users !== undefined) {
      name = this.users.find(user => user.uid === uid).displayName;  
    }

    if (name !== undefined) {
      return name;
    }
    return "Error";
  }

}
