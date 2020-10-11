import { SongPlatform } from './song-platform.enum';
import { User } from './user';

export interface Song {
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: User;
    author?: string;
    modifiers?: string[];
}

export const EMPTY_SONG: Song = {
    shortTitle: '',
    platform: SongPlatform.Youtube,
    url: '',
    patron: null,
}
