import { Component } from '@angular/core';
import { CurrentSection } from 'src/app/types/current-section.enum';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  constructor() { }

  SelectionType: typeof CurrentSection = CurrentSection;
}
