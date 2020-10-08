import { Injectable } from '@angular/core';
import { Constitution, MAX_LIMIT } from '../types/constitution';
import { EMPTY_SONG } from '../types/song';

@Injectable({
  providedIn: 'root'
})
export class ConstitutionManagerService {

  constitutions: Constitution[];

  constructor() {
    this.constitutions = [];
    this.initConstitution();
  }

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

    // this.constitutions.push(constitution7); 
  }
}
