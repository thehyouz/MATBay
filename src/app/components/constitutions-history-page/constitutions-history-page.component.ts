import { Component } from '@angular/core';
import { Constitution } from 'src/app/types/constitution';

@Component({
  selector: 'app-constitutions-history-page',
  templateUrl: './constitutions-history-page.component.html',
  styleUrls: ['./constitutions-history-page.component.scss']
})
export class ConstitutionsHistoryPageComponent {

  constitutionHistory: Constitution[];

  constructor() {
    this.constitutionHistory = [];
    this.initConstitution();
  }

  // Debug only
  initConstitution(): void {
    let constitution7: Constitution = {
      season: 2,
      round: 7,
      name: "Il Porco Rosso",
      isPublic: true,
      owner: '',
      winnerUserIndex: -1,
      users: [],
      songs: [],
      winnerSongIndex: -1,
      youtubePlaylistID: "https://www.youtube.com/playlist?list=PLrOgnGStT8Gj1pC2y0sZf8wDgoKRF0J-z",
      numberOfSongsPerUser: 25,
    }
    this.constitutionHistory.push(constitution7);
  }

}
