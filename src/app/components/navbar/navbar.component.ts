import { Component, Input } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentSection } from 'src/app/types/current-section.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public auth: AuthService) { }

  @Input()
  currentSection: CurrentSection = CurrentSection.Home;
  SelectionType: typeof CurrentSection = CurrentSection;
}
