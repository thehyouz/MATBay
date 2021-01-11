// https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { Constitution } from 'src/app/types/constitution';

@Component({
  selector: 'app-export-section',
  templateUrl: './export-section.component.html',
  styleUrls: ['./export-section.component.scss']
})
export class ExportSectionComponent {
  @Input() constitution: Constitution;

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor() { }

  returnConstitutionData() {
    return of(this.constitution.songs)
  }

  dynamicDownloadTxt() {
    this.returnConstitutionData().subscribe((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: this.constitution.name,
        text: JSON.stringify(res)
      });
    });
  }

  dyanmicDownloadByHtmlTag(arg: {fileName: string, text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }


}
