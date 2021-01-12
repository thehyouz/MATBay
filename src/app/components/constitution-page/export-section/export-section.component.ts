// https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';

const BASIC_TXT_HEADER: string = " ID |        Titre       |       Auteur       |     Ajouté Par      \n";
const TXT_SEPARATOR: string = "================================================================ \n"

@Component({
  selector: 'app-export-section',
  templateUrl: './export-section.component.html',
  styleUrls: ['./export-section.component.scss']
})
export class ExportSectionComponent {
  @Input() constitution: Constitution;
  @Input() users: User[];

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor() { }

  convertSongArrayToString(songs: Song[]): string {
    let text = BASIC_TXT_HEADER + TXT_SEPARATOR;
    for (const song of songs) {
      text += this.correctStringLength(song.id.toString(), 5) + "|" + this.correctStringLength(song.shortTitle, 26) + "|" + this.correctStringLength(song.author, 26) + "|" + this.correctStringLength(this.showDisplayName(song.patron), 25) + "\n";
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
    console.log("string l:", string.length);
    console.log("l", length);
    console.log("d", length - string.length);

    if (string.length < length) {
      for (let i = 0; i < length - string.length + 1; i++) {
        string += " ";
      }
    }
    return string;
  }

  returnConstitutionData() {
    return of(this.constitution.songs);
  }

  dynamicDownloadTxt(format: string) {
    this.returnConstitutionData().subscribe((songs) => {
      switch (format) {
        case "song-list":
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: this.convertSongArrayToString(songs)
          });
          break;
        case "json":
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: JSON.stringify(songs, null, 2)
          });
          break;
        case "sheets":
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
