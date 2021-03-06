// Angular
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatGridListModule } from '@angular/material/grid-list'
import { MatTabsModule } from '@angular/material/tabs'

// MDB
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// Component
import { AppComponent } from './app.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CurrentConstitutionsPageComponent } from './components/current-constitutions-page/current-constitutions-page.component';
import { ConstitutionsHistoryPageComponent } from './components/constitutions-history-page/constitutions-history-page.component';
import { NewConstitutionWindowComponent } from './components/new-constitution-window/new-constitution-window.component';
import { ManageSongsWindowComponent } from './components/manage-songs-window/manage-songs-window.component';
import { SongWindowComponent } from './components/song-window/song-window.component';
import { JoinConstitutionWindowComponent } from './components/join-constitution-window/join-constitution-window.component';
import { ConstitutionHistoryDetailsWindowComponent } from './components/constitution-history-details-window/constitution-history-details-window.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { WikiPageComponent } from './components/wiki-page/wiki-page.component';
import { RandomSongWindowComponent } from './components/random-song-window/random-song-window.component';
import { LeaveConstitutionWindowComponent } from './components/leave-constitution-window/leave-constitution-window.component';
import { ExportSectionComponent } from './components/constitution-page/section/export-section/export-section.component';

// ConstitutionPage
import { ConstitutionPageComponent } from './components/constitution-page/constitution-page.component';
import { SongListSectionComponent } from './components/constitution-page/section/song-list-section/song-list-section.component';
import { GradedVoteListSectionComponent } from './components/constitution-page/section/graded-constitution/vote-list-section/vote-list-section.component';
import { GradedSongWindowComponent } from './components/constitution-page/section/graded-constitution/vote-list-section/song-window/song-window.component';
import { GradedOwnerSectionComponent } from './components/constitution-page/section/graded-constitution/owner-section/owner-section.component';
import { GradedResultSectionComponent } from './components/constitution-page/section/graded-constitution/result-section/result-section.component';
import { RankedVoteListSectionComponent } from './components/constitution-page/section/ranked-constitution/vote-list-section/vote-list-section.component'
import { RankedResultSectionComponent } from './components/constitution-page/section/ranked-constitution/result-section/result-section.component';
import { RankedOwnerSectionComponent } from './components/constitution-page/section/ranked-constitution/owner-section/owner-section.component';

// Service
import { ConstitutionManagerService } from './services/manager/constitution-manager.service';

const firebaseConfig = {
  apiKey: "AIzaSyBljB_Xo7WNymFihDf0GCTDpy2wFMHdCqg",
  authDomain: "matbactivity.firebaseapp.com",
  databaseURL: "https://matbactivity.firebaseio.com",
  projectId: "matbactivity",
  storageBucket: "matbactivity.appspot.com",
  messagingSenderId: "1017121160583",
  appId: "1:1017121160583:web:d090e8f0c90868f737e722",
  measurementId: "G-MV7SEV55W1"
};

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    WelcomePageComponent,
    NavbarComponent,
    CurrentConstitutionsPageComponent,
    ConstitutionsHistoryPageComponent,
    NewConstitutionWindowComponent,
    SongWindowComponent,
    ManageSongsWindowComponent,
    ExportSectionComponent,
    GradedVoteListSectionComponent,
    JoinConstitutionWindowComponent,
    ConstitutionPageComponent,
    GradedResultSectionComponent,
    SongListSectionComponent,
    GradedOwnerSectionComponent,
    RankedVoteListSectionComponent,
    RankedResultSectionComponent,
    RankedOwnerSectionComponent,
    GradedSongWindowComponent,
    ConstitutionHistoryDetailsWindowComponent,
    UsersPageComponent,
    WikiPageComponent,
    RandomSongWindowComponent,
    LeaveConstitutionWindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatGridListModule,
    MatTabsModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [ConstitutionManagerService],
  entryComponents: [NewConstitutionWindowComponent, ManageSongsWindowComponent, SongWindowComponent, GradedSongWindowComponent, JoinConstitutionWindowComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
