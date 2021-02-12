import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { RankVote } from 'src/app/types/vote';

@Component({
  selector: 'ranked-vote-list-section',
  templateUrl: './vote-list-section.component.html',
  styleUrls: ['./vote-list-section.component.scss']
})
export class RankedVoteListSectionComponent implements OnInit {
  @Input() constitution: Constitution;
  @Input() currentUser: User;
  @Input() votes: RankVote[];

  public songsChoice: string[] = [];

  ngOnInit() {
    this.songsChoice.push("/");
    for (const song of this.constitution.songs) {
      this.songsChoice.push(song.shortTitle + " - " + song.author);
    }
  }

  constructor(private afs: AngularFirestore) {}

  array(n: number): any[] {
    return Array(n);
  }

  //TODO : Futur Update
  returnScore(rank: number): number {
    if (rank < 10) {return 9;}
    else if (rank < 19) {return 6;}
    else if (rank < 38) {return 3;}
    else if (rank === 38) {return 0;}
    else if (rank < 58) {return -1;}
    else if (rank < 67) {return -2;}
    else if (rank > 66 ) {return -3;}
  }

  findSong(songChoice: string): Song {
    return this.constitution.songs.find(x => x.shortTitle + " - " + x.author === songChoice);
  }

  isSelected(rank: number, songChoice: string): boolean {
    console.log(rank, songChoice);
    for (const vote of this.votes) {
      if (vote.userID === this.currentUser.uid) {
        if (vote.rank + 1 === rank) {
          return true;
        }
      }
    }
    return false;
  }

  updateRank(event: Event, newRank: number): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    const songChoice = eventCast.value;

    if (songChoice === "/") {
      return;
    }

    const song = this.findSong(songChoice);

    const newID = this.afs.createId();

    this.afs.collection('constitutions').doc(this.constitution.id).collection('votes').doc(newID).set({
      id: newID,
      userID: this.currentUser.uid,
      round: this.constitution.round,
      songID: song.id,
      rank: newRank,
      rankScore: this.returnScore(newRank)    //TODO : Futur Update
    });
  }

}
