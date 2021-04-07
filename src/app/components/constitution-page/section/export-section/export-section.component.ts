// https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { AUTHORISATION_LEVEL, User } from 'src/app/types/user';

const BASIC_TXT_HEADER = ' ID |        Titre       |       Auteur       |     Ajouté Par     |\n';
const TXT_SEPARATOR = '==================================================================== \n';

@Component({
  selector: 'export-section',
  templateUrl: './export-section.component.html',
  styleUrls: ['./export-section.component.scss']
})
export class ExportSectionComponent implements OnInit {
  @Input() constitution: Constitution;
  @Input() users: User[];

  private currentUser: User;
  public isUserLoading = true;

  public EXPORT_FORMAT: string[] = ['Liste des chansons', 'Google Sheets', 'csv'];
  public selectedExportFormat: string;

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  ngOnInit() {
    this.auth.user$.subscribe(newUser => {
      this.currentUser = newUser;
      if (newUser) {
        this.isUserLoading = false;
        if (this.currentUser.isAuthorized[AUTHORISATION_LEVEL.DEV_LEVEL]) {
          this.EXPORT_FORMAT.push('Objet JSON');
        }
      }
    });
  }

  constructor(private auth: AuthService, ) {
    this.selectedExportFormat = this.EXPORT_FORMAT[0];
  }

  updateSelectedFormat(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFormat = eventCast.value;
  }

  convertSongArrayToString(songs: Song[]): string {
    let text = BASIC_TXT_HEADER + TXT_SEPARATOR;
    for (const song of songs) {
      text += this.correctStringLength(song.id.toString(), 4) + '|' + this.correctStringLength(song.shortTitle, 20) + '|' + this.correctStringLength(song.author, 20) + '|' + this.correctStringLength(this.showDisplayName(song.patron), 20) + '|' + '\n';
    }
    return text;
  }

  convertSongArrayToGoogleSheets(songs: Song[]): string {
    let text = '';
    for (const song of songs) {
      text += '=LIEN_HYPERTEXTE("' + song.url + '"; "' + song.shortTitle + '")' + '\n';
    }
    return text;
  }

  convertSongArrayToCsv(_: Song[]): string {
    return this.constitution.songs.map((s) => `${s.id};${s.author};${s.shortTitle};${s.patron};${s.url}`).join('\n');
  }

  correctStringLength(string: string, length: number): string {
    return string.slice(0, length).padEnd(length);
  }

  returnConstitutionData() {
    return of(this.constitution.songs);
  }

  dynamicDownloadTxt(format: string) {
    this.returnConstitutionData().subscribe((songs) => {
      switch (format) {
        case 'Liste des chansons':
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: this.convertSongArrayToString(songs)
          });
          break;
        case 'Objet JSON':
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name + '.json',
            text: JSON.stringify(songs, null, 2)
          });
          break;
        case 'Google Sheets':
          this.dyanmicDownloadByHtmlTag({
            fileName: this.constitution.name,
            text: this.convertSongArrayToGoogleSheets(songs)
          });
          break;
          case 'csv':
            this.dyanmicDownloadByHtmlTag({
              fileName: this.constitution.name + '.csv',
              text: this.convertSongArrayToCsv(songs)
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

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return '';
  }

}
