import { Injectable } from '@angular/core';
import { GradeVote } from '../types/vote';

export interface UserMathProfile {
  uid: string,
  mean: number,
  var: number
}

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() {}

  generateUserMathProfile(uid: string, votes: GradeVote[]): UserMathProfile {
    const selectedVotesGrade = [];
    for(const vote of votes) {
      if (vote.userID === uid) {
        selectedVotesGrade.push(vote.grade + 1);
      }
    }

    const mean = this.mean(selectedVotesGrade);
    return {uid: uid, mean: mean, var: this.var(mean, selectedVotesGrade)};
  }

  mean(values: number[]): number {
    return values.reduce( (prev:number, current:number) => prev + current, 0) / values.length;
  }

  var(mean: number, values: number[]): number {
    return values.reduce((prev:number, current:number) => {return prev + Math.pow(current - mean, 2) }, 0) / (values.length-1);
  }

  standardNormalTable(mean: number, variance: number, value: number): number {
    if (value == mean) { return 0; }
    return (value - mean)/Math.sqrt(variance);
  }

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1 )) + min;
  }

}
