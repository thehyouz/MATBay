import { Component } from '@angular/core';
import { User } from '../../types/user';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/types/status';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  public currentStatus: Status;
  public profileForm: FormGroup;
  private currentUser: User;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder) {
    this.currentStatus = {
      error: false,
      hidden: true,
      message: "",
    }

    this.currentUser = auth.user$.getValue();
    auth.user$.subscribe(newUser => this.currentUser = newUser);

    this.profileForm = fb.group({
      displayName: [this.currentUser.displayName, Validators.required],
      photoURL: [this.currentUser.photoURL, Validators.required]
    })
  }

  testUpdate(): void {
    this.currentUser.displayName = this.profileForm.get('displayName').value;
    this.currentUser.photoURL = this.profileForm.get('photoURL').value;
    this.auth.updateUserData(this.currentUser).then(
      () => this.notifySuccess(),
      reason => this.notifyFailure(reason)
    )
  }

  notifySuccess(): void {
    this.currentStatus.error = false;
    this.currentStatus.hidden = false;
    this.currentStatus.message = "Vos modifications ont bien été enregistrées.";
  }

  notifyFailure(reason: any): void {
    this.currentStatus.error = true;
    this.currentStatus.hidden = false;
    if (reason.code && reason.code == "permission-denied") {
      this.currentStatus.message = "Une erreur d'authentification est survenue. Cette erreur peut survenir si vous essayer d'effectuer trop d'opérations trop rapidement."
    } else {
      this.currentStatus.message = reason;
    }
  }

}
