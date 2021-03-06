import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { Status } from 'src/app/types/status';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-join-constitution-window',
  templateUrl: './join-constitution-window.component.html',
  styleUrls: ['./join-constitution-window.component.scss']
})
export class JoinConstitutionWindowComponent {
  private currentUser: User;
  public joinConstitutionForm: FormGroup;
  public currentStatus: Status;

  constructor(private dialogRef: MatDialogRef<JoinConstitutionWindowComponent>,
              private auth: AuthService,
              private afs: AngularFirestore,
              private router: Router) {

    this.currentUser = this.auth.user$.getValue();
    this.auth.user$.subscribe(newUser => this.currentUser = newUser);
    
    this.currentStatus = {
      error: false,
      hidden: true,
      message: ""
    }

    this.joinConstitutionForm = new FormGroup({
      formID: new FormControl(),
    });
  }

  joinConstitution(): void {
    const id: string = this.joinConstitutionForm.value['formID'];
    if (id !== null) {
      this.afs.collection('constitutions').doc(id).get().toPromise().then(doc => {
        if (!doc.exists) {
          this.currentStatus.error = true;
          this.currentStatus.message = "Erreur : La constitution n'existe pas."
        } else {
          const data = doc.data() as Constitution;
          if (data.users.length < data.numberMaxOfUser) {
            if (data.users.findIndex(x => x === this.currentUser.uid) === -1) {
              let newUsers = data.users;
              newUsers.push(this.currentUser.uid);
              this.afs.collection('constitutions').doc(id).update({
                users: newUsers
              });
              this.router.navigate(['current-constitutions/' + id]);
              this.closeWindow();
            } else {
              this.currentStatus.error = true;
              this.currentStatus.message = "Erreur : Vous avez déjà rejoint cette constitution."
            }
          } else {
            this.currentStatus.error = true;
            this.currentStatus.message = "Erreur : La constitution est complète."
          }
        }
      });
    } else {
      this.currentStatus.error = true;
      this.currentStatus.message = "Erreur : Il n'y a pas d'ID."
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
