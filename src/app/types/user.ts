export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;

    timestamp: firebase.firestore.FieldValue;
}

export const EMPTY_USER: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    timestamp: null
}
