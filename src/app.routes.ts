import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RaffleComponent } from './components/raffle/raffle.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { registrationGuard } from './guards/registration.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CameraScanDocumentComponent } from './components/camera-scan-document/camera-scan-document.component';
import { EmailSentComponent } from './components/email-sent/email-sent.component';
import { emailSentGuard } from './guards/email-sent.guard';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-sent', component: EmailSentComponent, canActivate: [emailSentGuard] },


  // { path: 'camera-scan', component: CameraScanDocumentComponent, canActivate: [registrationGuard] },
  { path: 'camera-scan', component: CameraScanDocumentComponent },

  // { path: 'raffle', component: RaffleComponent, canActivate: [registrationGuard] },
  { path: 'raffle', component: RaffleComponent },


  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },


  { path: '', redirectTo: '/camera-scan', pathMatch: 'full' },
  { path: '**', redirectTo: '/camera-scan' }

  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' }


];

