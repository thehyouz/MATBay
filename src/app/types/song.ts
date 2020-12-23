import { SongPlatform } from './song-platform.enum';

export interface Song {
    id: string,
    constitutionNumber: number,
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: string;
    author: string;
    // modifiers?: string[];
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
