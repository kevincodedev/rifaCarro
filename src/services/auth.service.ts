// Fix: Import `inject` to use for dependency injection.
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fix: Injected the Router service instead of creating a new instance.
  private readonly router = inject(Router);
  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string>('');
  userName = signal<string>('');

  login(email: string): void {
    this.isAuthenticated.set(true);
    this.userEmail.set(email);
    this.router.navigate(['/raffle']);
  }

  register(email: string): void {
    // In a real app, this would also set up the user account.
    this.isAuthenticated.set(true);
    this.userEmail.set(email);
    this.router.navigate(['/raffle']);
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userEmail.set('');
    this.userName.set('');
    this.router.navigate(['/login']);
  }

  saveUserName(name: string): void {
    this.userName.set(name);
  }
}
