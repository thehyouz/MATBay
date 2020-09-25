import { User } from 'firebase';
import { Song } from './song';

export interface Constitution {
    season: number;
    round: number;
    president: User;
    winner: User;
    songs: Song[];
    youtubePlaylistID: string;
}
