import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Constitution } from 'src/app/types/constitution';
import { User } from 'src/app/types/user';
import { GradeVote, RankVote } from 'src/app/types/vote';

@Component({
  selector: 'app-leave-constitution-window',
  templateUrl: './leave-constitution-window.component.html',
  styleUrls: ['./leave-constitution-window.component.scss']
})
export class LeaveConstitutionWindowComponent {

  public constitution: Constitution;
  private currentUser: User;
  private votes: GradeVote[] | RankVote[];

  constructor(private dialogRef: MatDialogRef<LeaveConstitutionWindowComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private afs: AngularFirestore,
              private router: Router) {
    this.constitution = data.constitution;
    this.votes = data.votes;
    this.currentUser = data.currentUser;
  }

  leaveConstitution(): void {
    if (this.constitution.owner === this.currentUser.uid) return;

    const index = this.constitution.users.findIndex(x => x === this.currentUser.uid);
    this.constitution.users.splice(index, 1);

    this.afs.collection("constitutions/").doc(this.constitution.id).update({
      users: this.constitution.users
    });

    for (const song of this.constitution.songs) {
      if (song.patron === this.currentUser.uid) {
        this.afs.collection("constitutions/").doc(this.constitution.id).collection("/songs").doc(song.id.toString()).delete();
        for (const vote of this.votes) {
          if (vote.songID === song.id) {
            this.afs.collection("constitutions/").doc(this.constitution.id).collection("/votes").doc(vote.id).delete();
          }
        }
      }
    }

    for (const vote of this.votes) {
      if (vote.userID === this.currentUser.uid) {
        this.afs.collection("constitutions/").doc(this.constitution.id).collection("/votes").doc(vote.id).delete();
      }
    }

    this.router.navigate(['current-constitutions']);
    this.closeWindow();
  }

  closeWindow(): void {
    this.dialogRef.close();
  }
}
