import { Component } from '@angular/core';
import { User } from '../../types/user';
import { AuthService } from 'src/app/services/auth.service';

interface Status {
  error: boolean;
  hidden: boolean;
  message: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  public currentStatus: Status;
  private userValue: User;

  constructor(public auth: AuthService) {
    this.currentStatus = {
      error: false,
      hidden: true,
      message: "",
    }
    this.auth.user$.subscribe(newUser => this.userValue = newUser);
  }

  testUpdate(): void {
    this.auth.updateUserData(this.userValue).then(
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
