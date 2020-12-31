import { SongPlatform } from './song-platform.enum';

export interface Song {
    id: string,
    constitutionNumber: number,
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: string;
    author: string;
}

export const EMPTY_SONG: Song = {
    id: '',
    constitutionNumber: -1,
    shortTitle: '',
    platform: -1,
    url: '',
    author: '',
    patron: ''
}

export function compareSongConstitutionNumberASC(song1: Song, song2: Song): number {
    if (song1.constitutionNumber > song2.constitutionNumber) { return 1; }
    if (song1.constitutionNumber < song2.constitutionNumber) { return -1; }
    return 0;
}

export function compareSongConstitutionNumberDSC(song1: Song, song2: Song): number {
    if (song1.constitutionNumber > song2.constitutionNumber) { return 1; }
    if (song1.constitutionNumber < song2.constitutionNumber) { return -1; }
    return 0;
}

export function compareSongShortTitleASC(song1: Song, song2: Song): number {
    if (song1.shortTitle > song2.shortTitle) { return 1; }
    if (song1.shortTitle < song2.shortTitle) { return -1; }
    return 0;
}

export function compareSongShortTitleDSC(song1: Song, song2: Song): number {
    if (song1.shortTitle > song2.shortTitle) { return -1; }
    if (song1.shortTitle < song2.shortTitle) { return 1; }
    return 0;
}
