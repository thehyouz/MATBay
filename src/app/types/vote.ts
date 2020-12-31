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

export function extractValuesOfVotesSOC(votes: VoteSOC[]): number[] {
    let array: number[] = [];
    for (const vote of votes) {
      array.push(vote.grade + 1);   // + 1 --> les notes stockés sur Firebase vont de 0 à 9
    }
    return array;
}