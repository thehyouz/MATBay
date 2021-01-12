import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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
    const dialogConfig = new MatDialogConfig;

    dialogConfig.hasBackdrop = true;
    dialogConfig.maxWidth = '50%';
    dialogConfig.maxHeight = '90%';

    this.dialog.open(NewConstitutionWindowComponent, dialogConfig);
  }

  changeCurrentSection(newSection: CurrentSection): void {
    this.currentSection = newSection;
  }
}
