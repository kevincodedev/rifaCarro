// src/components/login/login.component.ts

import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  email = signal('info@pafar.net');
  password = signal('123456');
  // Añadimos una señal para manejar errores
  loginError = signal<string | null>(null);

  private authService = inject(AuthService);

  // Convertimos el método login a asíncrono
  async login(): Promise<void> {
    if (this.email() && this.password()) {
      this.loginError.set(null); // Reseteamos el error
      const success = await this.authService.login(this.email(), this.password());
      if (!success) {
        this.loginError.set('Correo o contraseña incorrectos.');
      }
    }
  }
}