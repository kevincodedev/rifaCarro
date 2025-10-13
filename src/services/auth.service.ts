import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string>('');
  userName = signal<string>('');
  authToken = signal<string | null>(null);

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/login_check`, {
          username: email,
          password: password,
        })
      );

      if (response && response.token) {
        this.authToken.set(response.token);
        this.isAuthenticated.set(true);
        this.userEmail.set(email);



        this.router.navigate(['/profile']); 
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      this.logout();
      return false;
    }
  }

  async register(email: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/validate/email`, { email })
      );
      this.router.navigate(['/login']);
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userEmail.set('');
    this.userName.set('');
    this.authToken.set(null);
    localStorage.removeItem('idCardPhoto');
    this.router.navigate(['/login']);
  }

  saveUserName(name: string): void {
    this.userName.set(name);
  }
}