export interface VoteSOC {
    id: string,
    userID: string,
    songID: number,
    grade: number
}

export interface ResultSOC {
    id: number,
    title: string,
    author: string,
    url: string,
    score: number,
    user: string
}

export const EMPTY_VOTE_SOC = {
    id: "",
    userID: "",
    songID: -1,
    grade: -1
}

export function extractValuesOfVotesSOC(votes: VoteSOC[]): number[] {
    let array: number[] = [];
    for (const vote of votes) {
      array.push(vote.grade + 1);   // + 1 --> les notes stockés sur Firebase vont de 0 à 9
    }
    return array;
}

export function compareResultScoreDSC(result1: ResultSOC, result2: ResultSOC) {
    if (result1.score > result2.score) { return -1; }
    if (result1.score < result2.score) { return 1; }
    return 0;
}