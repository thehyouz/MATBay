import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatAccordion } from '@angular/material/expansion';
import { Sort } from '@angular/material/sort';
import { GradedConstitutionService } from 'src/app/services/constitution/graded-constitution.service';
import { MathService } from 'src/app/services/math.service';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { extractValuesOfVotes, GradeVote, ResultGradeVote } from 'src/app/types/vote';

@Component({
  selector: 'graded-result-section',
  templateUrl: './result-section.component.html',
  styleUrls: ['./result-section.component.scss']
})
export class GradedResultSectionComponent implements OnInit {
  @Input() constitution: Constitution;
  @Input() users: User[];
  @Input() votes: GradeVote[];
  @Input() currentUser: User;
  
  public results: ResultGradeVote[];
  public winner: ResultGradeVote;

  private gradedConstitution: GradedConstitutionService

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit() {
    this.gradedConstitution = new GradedConstitutionService(this.math, this.afs, this.constitution, this.users, this.votes);
    this.results = this.gradedConstitution.results;
    this.winner = this.results[0];
  }

  constructor(private math: MathService,
              private afs: AngularFirestore) {
  }

  returnGrade(user: User, song: Song): number {
    const vote = this.votes.find(x => (x.songID === song.id) && (x.userID === user.uid));
    if (vote !== undefined) {
      return vote.grade + 1;
    }
  }

  returnUser(uid: string): User {
    return this.users.find(x => x.uid === uid);
  }

  userMeanVotes(uid: string): number {
    const currentUserVote: GradeVote[] = [];
    for (const vote of this.votes) {
      if (vote.userID === uid) {
        currentUserVote.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotes(currentUserVote));
  }

  userMeanSongs(uid: string): number {
    if (this.constitution.songs === undefined) return 0;
    const currentUserSongsVote: GradeVote[] = [];
    for (const vote of this.votes) {
      if (this.constitution.songs.find(x => x.id === vote.songID && x.patron === uid)) {
        currentUserSongsVote.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotes(currentUserSongsVote));
  }

  userMeanUser(uid1: string, uid2: string): number {
    const user1Songs: Song[] = [];
    for (const song of this.constitution.songs) {
      if (song.patron === uid1) {
        user1Songs.push(song);
      }
    }
    const user2Votes: GradeVote[] = [];
    for (const vote of this.votes) {
      if (user1Songs.find(x => x.id === vote.songID && x.patron === uid1 && vote.userID === uid2)) {
        user2Votes.push(vote);
      }
    }
    return this.math.mean(extractValuesOfVotes(user2Votes));
  }

  sortDataResult(sort: Sort) {
    if (this.results === undefined) {
      this.results = this.gradedConstitution.results;
    }
    
    if(!sort.active || sort.direction === '') { return; }

    const data = this.results.slice();
    this.results = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case "position": return this.compare(a.position, b.position, isAsc);
        case "title": return this.compare(a.title, b.title, isAsc);
        case "author": return this.compare(a.author, b.author, isAsc);
        case "user": return this.compare(this.showDisplayName(a.userID), this.showDisplayName(b.userID), isAsc);
        case "score": return this.compare(a.score, b.score, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }


}
