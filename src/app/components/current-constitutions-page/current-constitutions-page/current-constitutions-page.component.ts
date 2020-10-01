import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constitution, MAX_LIMIT } from 'src/app/types/constitution';
import { EMPTY_SONG } from 'src/app/types/song';
import { NewConstitutionWindowComponent } from '../../new-constitution-window/new-constitution-window/new-constitution-window.component';

@Component({
  selector: 'app-current-constitutions-page',
  templateUrl: './current-constitutions-page.component.html',
  styleUrls: ['./current-constitutions-page.component.scss']
})
export class CurrentConstitutionsPageComponent {

  currentConstitutions: Constitution[];

  constructor(private dialog: MatDialog) {
    this.currentConstitutions = [];
    this.initConstitution();
  }

  openDialog(): void {
    console.log("hello");
    this.dialog.open(NewConstitutionWindowComponent);
  }

  // Debug only
  initConstitution(): void {
    let constitution7: Constitution = {
      season: 2,
      round: 7,
      name: "Il Porco Rosso",
      isPublic: true,
      president: null,
      winnerUser: null,
      users: [],
      songs: [],
      winnerSong: EMPTY_SONG,
      youtubePlaylistID: "https://www.youtube.com/playlist?list=PLrOgnGStT8Gj1pC2y0sZf8wDgoKRF0J-z",
      numberOfSongsPerUser: 25,
      numberOfSongsMax: MAX_LIMIT
    }

    for (let i = 0; i < 60; i++) {
      this.currentConstitutions.push(constitution7); 
    }
  }

}
