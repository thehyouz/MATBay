// GradeVote

export interface GradeVote {
    id: string,
    userID: string,
    songID: number,
    grade: number
}

export interface ResultGradeVote {
    songID: number,
    title: string,
    author: string,
    url: string,
    score: number,
    userID: string
}

export const EMPTY_GRADE_VOTE = {
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

// RankingVote
