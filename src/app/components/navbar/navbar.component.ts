import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentSection } from 'src/app/types/current-section.enum';
import { NewConstitutionWindowComponent } from '../new-constitution-window/new-constitution-window.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public auth: AuthService,
              private dialog: MatDialog) { }

  @Input()
  currentSection: CurrentSection = CurrentSection.Home;
  SelectionType: typeof CurrentSection = CurrentSection;

  openDialog(): void {
    this.dialog.open(NewConstitutionWindowComponent);
  }
}
