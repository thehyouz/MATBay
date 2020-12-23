import { SongPlatform } from './song-platform.enum';

export interface Song {
    id: number,
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: string;
    author: string;
    // modifiers?: string[];
}

export const EMPTY_SONG: Song = {
    id: -1,
    shortTitle: '',
    platform: -1,
    url: '',
    author: '',
    patron: ''
}
