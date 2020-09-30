export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;

    timestamp: firebase.firestore.FieldValue;
}
