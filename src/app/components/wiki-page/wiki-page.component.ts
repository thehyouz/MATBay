import { Component } from '@angular/core';
import { SECTIONS } from 'src/app/constants/sections';

@Component({
  selector: 'app-wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.scss']
})
export class WikiPageComponent {

  public sections: string[];
  public selected: string;

  constructor() { 
    this.sections = SECTIONS;
    this.selected = this.sections[0];
  }

  isSelected(section: string): boolean {
    return section === this.selected;
  }

  selectSection(section: string): void {
    this.selected = section;
  }

  previousSectionExist(): boolean {
    const index = this.sections.findIndex(x => x === this.selected);
    return index - 1 >= 0;
  }

  nextSectionExist(): boolean {
    const index = this.sections.findIndex(x => x === this.selected);
    return index + 1 < this.sections.length;
  }

}
