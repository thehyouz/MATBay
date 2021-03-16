import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';
import { compareResultScoreDSC, GradeVote, ResultGradeVote } from 'src/app/types/vote';
import { MathService, UserMathProfile } from '../math.service';

@Injectable({
  providedIn: 'root'
})
export class GradedConstitutionService {

  constructor(private math: MathService,
              private afs: AngularFirestore,
              private constitution: Constitution,
              private users: User[],
              private votes: GradeVote[]) { }

  generateUsersMathProfile(): UserMathProfile[] {
    const mathProfiles: UserMathProfile[] = [];
    for (const user of this.users) {
      mathProfiles.push(this.math.generateUserMathProfile(user.uid, this.votes));
    }
    return mathProfiles;
  }


  calculateResults(): ResultGradeVote[] {
    if (this.constitution.songs.length === 0) {
      return [];
    }

    const mathProfiles: UserMathProfile[] = this.generateUsersMathProfile();

    const results: ResultGradeVote[] = [];
    for(const song of this.constitution.songs) {
      const selectedVotes: GradeVote[] = [];
      for(const vote of this.votes) {
        // Add all votes for a song
        if (vote.songID === song.id) {
          selectedVotes.push(vote);
        }
      }

      let score: number = 0;
      // normal the score of each user
      for (const vote of selectedVotes) {
        const mathProfile = mathProfiles.find(x => x.uid === vote.userID);
        score += this.math.standardNormalTable(mathProfile.mean, mathProfile.var, vote.grade + 1);
      }

      const user = this.users.find(x => {return x.uid === song.patron});
      if (user !== undefined) {
        results.push({
          position: -1,
          songID: song.id,
          title: song.shortTitle,
          author: song.author,
          url: song.url,
          score: score,
          userID: user.uid
        });
      }
    }

    results.sort(compareResultScoreDSC);

    for(const result of results) {
      result.position = results.findIndex(x => x.songID === result.songID) + 1;
    }

    if (this.constitution.winnerSongID === -1 || this.constitution.winnerUserID === '') {
      this.afs.collection("constitutions/").doc(this.constitution.id).update({
        winnerSongID: results[0].songID,
        winnerUserID: results[0].userID
      });
    }

    return results;
  }
}
