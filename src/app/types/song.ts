import { User } from 'firebase';
import { SongPlatform } from './song-platform.enum';

export interface Song {
    shortTitle: string;
    platform: SongPlatform;
    url: string;
    patron: User;
    author?: string;
    modifiers?: string[];
}
