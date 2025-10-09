import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RaffleComponent } from './components/raffle/raffle.component';
import { SuccessComponent } from './components/success/success.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CameraScanDocumentComponent } from './components/camera-scan-document/camera-scan-document.component';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'camera-scan', component: CameraScanDocumentComponent, canActivate: [authGuard] },
  { path: 'raffle', component: RaffleComponent, canActivate: [authGuard] },
  { path: 'success', component: SuccessComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

