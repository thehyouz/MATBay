// https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';

const BASIC_TXT_HEADER: string = " ID |        Titre       |       Auteur       |     Ajouté Par     |\n";
const TXT_SEPARATOR: string = "==================================================================== \n"

@Component({
  selector: 'app-export-section',
  templateUrl: './export-section.component.html',
  styleUrls: ['./export-section.component.scss']
})
export class ExportSectionComponent {
  @Input() constitution: Constitution;
  @Input() users: User[];

  EXPORT_FORMAT: string[] = ["Liste des chansons", "Google Sheets", "Objet JSON"];
  selectedExportFormat: string;

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor() {
    this.selectedExportFormat = this.EXPORT_FORMAT[0];
  }

  updateSelectedFormat(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFormat = eventCast.value;
  }

  convertSongArrayToString(songs: Song[]): string {
    let text = BASIC_TXT_HEADER + TXT_SEPARATOR;
    for (const song of songs) {
      text += this.correctStringLength(song.id.toString(), 4) + "|" + this.correctStringLength(song.shortTitle, 20) + "|" + this.correctStringLength(song.author, 20) + "|" + this.correctStringLength(this.showDisplayName(song.patron), 20) + "|" + "\n";
    }
    return text;
  }

  convertSongArrayToGoogleSheets(songs: Song[]): string {
    let text = "";
    for (const song of songs) {
      text += '=LIEN_HYPERTEXTE("' + song.url + '"; "' + song.shortTitle + '")' + "\n";
    }
    return text;
  }

  correctStringLength(string: string, length: number): string {
    if (string.length < length) {
      while (string.length !== length) {
        string += " ";
      }
    } else if (string.length > length) {
      string = string.slice(0, length);
    }
    return string;
  }

  returnConstitutionData() {
    return of(this.constitution.songs);
  }

  dynamicDownloadTxt(format: string) {
    this.returnConstitutionData().subscribe((songs) => {
      switch (format) {
        case "Liste des chansons":
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: this.convertSongArrayToString(songs)
          });
          break;
        case "Objet JSON":
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: JSON.stringify(songs, null, 2)
          });
          break;
        case "Google Sheets":
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: this.convertSongArrayToGoogleSheets(songs)
          });
          break;
        default:
          this.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name,
          text: this.convertSongArrayToString(songs)
        });
      }
      
    });
  }

  private dyanmicDownloadByHtmlTag(arg: {fileName: string, text: string}) {
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

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }

}
