import { Song } from './song';

export const MIN_USER_LIMIT = 2;
export const MAX_USER_LIMIT = 10;
export const MAX_SONG_LIMIT = 100;

export enum ConstitutionType {
    // GRADE, RANKING, ELIMINATION, TOURNAMENT
    SOC, FMTTM
}

export interface Constitution {
    id: string;

    season: number;
    round: number;
    name: string;
    isPublic: boolean;
    type: ConstitutionType;
    isLocked: boolean;
    isShowingResult: boolean;

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
    isLocked: false,
    isShowingResult: false,
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

export function compareConstitutionASC(c1: Constitution, c2: Constitution): number {
    if (c1.season > c2.season) { return 1; }
    if (c1.season < c2.season) { return -1; }
    else {
        if (c1.round > c2.round) { return 1; }
        if (c1.round < c2.round ) { return -1; }
    }
}
