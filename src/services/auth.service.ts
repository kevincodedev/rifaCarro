// 1. Importa HttpClient y environment
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
  // 2. Inyecta HttpClient
  private readonly http = inject(HttpClient);

  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string>('');
  userName = signal<string>('');
  // 3. Añade una señal para el token
  authToken = signal<string | null>(null);

  // 4. Modifica el método login para que sea asíncrono y consuma el servicio
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/login_check`, {
          username: email,
          password: password,
        })
      );

      if (response && response.token) {
        // Guarda el token y actualiza el estado de autenticación
        this.authToken.set(response.token);
        this.isAuthenticated.set(true);
        this.userEmail.set(email);
        this.router.navigate(['/raffle']);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      this.logout();
      return false;
    }
  }

  register(email: string): void {
    this.isAuthenticated.set(true);
    this.userEmail.set(email);
    this.router.navigate(['/raffle']);
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userEmail.set('');
    this.userName.set('');
    this.authToken.set(null); // Limpia el token al cerrar sesión
    this.router.navigate(['/login']);
  }

  saveUserName(name: string): void {
    this.userName.set(name);
  }
}