export interface VoteSOC {
    id: string,
    userID: string,
    songID: number,
    grade: number
}

export const EMPTY_VOTE_SOC = {
    id: "",
    userID: "",
    songID: -1,
    grade: -1
}