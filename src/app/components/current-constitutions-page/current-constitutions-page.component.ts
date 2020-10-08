import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConstitutionManagerService } from 'src/app/services/constitution-manager.service';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-current-constitutions-page',
  templateUrl: './current-constitutions-page.component.html',
  styleUrls: ['./current-constitutions-page.component.scss']
})
export class CurrentConstitutionsPageComponent {

  private currentUser: User;

  constructor(public constitutionManager: ConstitutionManagerService,
              public auth: AuthService) {
                this.currentUser = auth.user$.getValue();
                auth.user$.subscribe(newUser => this.currentUser = newUser);
              }

  isAuthorized(constitution: Constitution): boolean {
    const isOwner: boolean = (constitution.president.displayName === this.currentUser.displayName);
    let isMember: boolean = false;
    for (const user of constitution.users) {
      if (user.displayName === this.currentUser.displayName) {
        isMember = true;
      }
    }
    return isOwner || isMember || constitution.isPublic;
  }

}
