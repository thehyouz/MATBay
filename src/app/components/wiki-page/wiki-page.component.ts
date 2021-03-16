import { Component } from '@angular/core';

@Component({
  selector: 'app-wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.scss']
})
export class WikiPageComponent {

  public sections: string[];
  private selected: string;

  constructor() { 
    this.sections = ["Matbay", "Constitution Note"];
    this.selected = this.sections[0];
  }

  isSelected(section: string): boolean {
    return section === this.selected;
  }

  selectSection(section: string): void {
    this.selected = section;
  }

}
