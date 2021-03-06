export enum AUTHORISATION_LEVEL {
    USER_LEVEL = 0,
    DEV_LEVEL
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    isAuthorized: [boolean, boolean];
    timestamp: firebase.firestore.FieldValue;
}

export const EMPTY_USER: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    isAuthorized: [false, false],
    timestamp: null
}

export function compareUserNameASC(user1: User, user2: User): number {
    if (user1.displayName > user2.displayName) {return 1;}
    if (user1.displayName < user2.displayName) {return -1;}
    return 0;
}

export function compareUserNameDSC(user1: User, user2: User): number {
    if (user1.displayName > user2.displayName) {return -1;}
    if (user1.displayName < user2.displayName) {return 1;}
    return 0;
}
