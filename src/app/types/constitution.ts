import { Song } from './song';

export const MIN_USER_LIMIT = 4;
export const MAX_USER_LIMIT = 10;
export const MAX_SONG_LIMIT = 100;

export enum ConstitutionType {
    SOC, FMTTM
}

export interface Constitution {
    id: string;

    season: number;
    round: number;
    name: string;
    isPublic: boolean;
    type: ConstitutionType;
    // isLocked: boolean;

    // Users
    owner: string;
    users: string[];
    winnerUserIndex: number;
    numberMaxOfUser: number;
    isAnonymous: boolean;

    // Songs
    songs: Song[];
    winnerSongIndex: number;
    youtubePlaylistID: string;
    numberOfSongsPerUser: number;
}

export const EMPTY_CONSTITUTION: Constitution = {
    id: "",
    season: -1,
    round: -1,
    name: "",
    isPublic: false,
    type: 0,
    owner: "",
    users: [],
    winnerUserIndex: -1,
    numberMaxOfUser: -1,
    isAnonymous: false,
    songs: [],
    winnerSongIndex: -1,
    youtubePlaylistID: "",
    numberOfSongsPerUser: -1
}
