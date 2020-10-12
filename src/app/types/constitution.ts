import { Song } from './song';

export interface Constitution {
    season: number;
    round: number;
    name: string;
    isPublic: boolean;

    // Users
    owner: string;
    users: string[];
    winnerUserIndex: number;

    // Songs
    songs: Song[];
    winnerSongIndex: number;
    youtubePlaylistID: string;
    numberOfSongsPerUser: number;
}
