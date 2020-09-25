import { Component } from '@angular/core';
import { CurrentSection } from 'src/app/types/current-section.enum';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  constructor() { }

  SelectionType: typeof CurrentSection = CurrentSection;
}
