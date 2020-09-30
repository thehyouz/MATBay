import { Component } from '@angular/core';
import { Constitution, MAX_LIMIT } from 'src/app/types/constitution';
import { EMPTY_SONG } from 'src/app/types/song';

@Component({
  selector: 'app-current-constitutions-page',
  templateUrl: './current-constitutions-page.component.html',
  styleUrls: ['./current-constitutions-page.component.scss']
})
export class CurrentConstitutionsPageComponent {

  currentConstitutions: Constitution[];

  constructor() {
    this.currentConstitutions = [];
    this.initConstitution();
  }

  initConstitution(): void {
    let constitution7: Constitution = {
      season: 2,
      round: 7,
      name: "Il Porco Rosso",
      president: null,
      winnerUser: null,
      users: [],
      songs: [],
      winnerSong: EMPTY_SONG,
      youtubePlaylistID: '',
      numberOfSongsPerUser: 25,
      numberOfSongsMax: MAX_LIMIT
    } 
    let constitution5: Constitution ={
      season: 2,
      round: 5,
      name: "Les Démons de minuits",
      president: null,
      winnerUser: null,
      users: [],
      songs: [],
      winnerSong: EMPTY_SONG,
      youtubePlaylistID: '',
      numberOfSongsPerUser: 25,
      numberOfSongsMax: MAX_LIMIT
    }

    this.currentConstitutions.push(constitution5, constitution7);
  }

}
