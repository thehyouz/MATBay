// GradeVote
export interface GradeVote {
    id: string,
    userID: string,
    songID: number,
    grade: number
}

export interface ResultGradeVote {
    position: number
    songID: number,
    title: string,
    author: string,
    url: string,
    score: number,
    userID: string
}

export const EMPTY_GRADE_VOTE: GradeVote = {
    id: "",
    userID: "",
    songID: -1,
    grade: -1
}

export function extractValuesOfVotes(votes: GradeVote[]): number[] {
    let array: number[] = [];
    for (const vote of votes) {
      array.push(vote.grade + 1);   // + 1 --> les notes stockés sur Firebase vont de 0 à 9
    }
    return array;
}

export function compareResultScoreDSC(result1: ResultGradeVote, result2: ResultGradeVote) {
    if (result1.score > result2.score) { return -1; }
    if (result1.score < result2.score) { return 1; }
    return 0;
}

// RankVote
export interface RankVote {
    id: string,
    userID: string,
    songID: number,
    round: number,
    rank: number,
    rankScore: number
}

export const EMPTY_RANK_VOTE: RankVote = {
    id: "",
    userID: "",
    songID: -1,
    round: -1,
    rank: -1,
    rankScore: -1
}
