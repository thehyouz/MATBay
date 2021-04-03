import { Song } from './song';

export const MIN_USER_LIMIT = 2;
export const MAX_USER_LIMIT = 10;
export const MAX_SONG_LIMIT = 100;

export enum ConstitutionType {
    GRADE,
    RANK
}

export interface Constitution {
    id: string;
    season: number;
    part: number;
    name: string;
    isPublic: boolean;
    type: ConstitutionType;
    isLocked: boolean;
    isShowingResult: boolean;

    // userTurnID: string;
    // startDate: Date;
    round: number;

    // Users
    owner: string;
    users: string[];
    winnerUserID: string;
    numberMaxOfUser: number;
    isAnonymous: boolean;

    // Songs
    songs: Song[];
    winnerSongID: number;
    youtubePlaylistID: string;
    numberOfSongsPerUser: number;
}

export const EMPTY_CONSTITUTION: Constitution = {
    id: "",
    season: -1,
    part: -1,
    name: "",
    isPublic: false,
    isLocked: false,
    isShowingResult: false,
    type: 0,
    round: 0,
    owner: "",
    users: [],
    winnerUserID: '',
    numberMaxOfUser: -1,
    isAnonymous: false,
    songs: [],
    winnerSongID: -1,
    youtubePlaylistID: "",
    numberOfSongsPerUser: -1
}

export interface ConstitutionArchived {
    season: number;
    part: number;
    name: string;
    youtubePlaylistID: string;
    ownerID: string;

    usernames: string[];
    songsTitle: string[];
    songsOwner: string[];
    songsURL: string[];
    songsAuthor: string[];

    winnerID: string;
    winnerSongURL: string;
    winnerSongTitle: string;
    winnerSongAuthor: string;
}

export function compareConstitutionASC(c1: Constitution | ConstitutionArchived, c2: Constitution | ConstitutionArchived): number {
    if (c1.season > c2.season) { return 1; }
    if (c1.season < c2.season) { return -1; }
    else {
        if (c1.part > c2.part) { return 1; }
        if (c1.part < c2.part ) { return -1; }
    }
}
