
import { Song } from './song';
import { User } from './user';

export const MAX_LIMIT = 100;

export interface Constitution {
    season: number;
    round: number;
    name: string;
    isPublic: boolean;

    // Users
    president: User;
    winnerUser: User;
    users: User[];

    // Songs
    songs: Song[];
    winnerSong: Song;
    youtubePlaylistID: string;
    numberOfSongsPerUser: number;
    numberOfSongsMax: number;
}
