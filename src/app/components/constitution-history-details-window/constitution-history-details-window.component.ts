import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ConstitutionArchived } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-constitution-history-details-window',
  templateUrl: './constitution-history-details-window.component.html',
  styleUrls: ['./constitution-history-details-window.component.scss']
})
export class ConstitutionHistoryDetailsWindowComponent {

  public constitution: ConstitutionArchived;
  public users: User[];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private dialogRef: MatDialogRef<ConstitutionHistoryDetailsWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data) { 
      this.constitution = data.constitution;
      this.users = data.users;
  }

  array(n: number): any[] {
    return Array(n);
  }

  returnUser(uid: string): User {
    return this.users.find(x => x.uid === uid);
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
