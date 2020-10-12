import { Routes } from '@angular/router';
import { ConstitutionsHistoryPageComponent } from '../components/constitutions-history-page/constitutions-history-page.component';
import { CurrentConstitutionsPageComponent } from '../components/current-constitutions-page/current-constitutions-page.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { AuthGuard } from '../guards/auth.guard';

export const ROUTES: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
    { path: 'current-constitutions', component: CurrentConstitutionsPageComponent },
    { path: 'constitutions-history', component: ConstitutionsHistoryPageComponent }
];