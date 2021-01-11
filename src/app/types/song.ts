import { SongPlatform } from './song-platform';

export interface Song {
    id: number
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: string;
    author: string;
}

export const EMPTY_SONG: Song = {
    id: -1,
    shortTitle: '',
    platform: -1,
    url: '',
    author: '',
    patron: ''
}

export function compareSongIdASC(song1: Song, song2: Song): number {
    if (song1.id > song2.id) { return 1; }
    if (song1.id < song2.id) { return -1; }
    return 0;
}

export function compareSongIdDSC(song1: Song, song2: Song): number {
    if (song1.id > song2.id) { return -1; }
    if (song1.id < song2.id) { return 1; }
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
