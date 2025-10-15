import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  email = signal('');
  
  registerError = signal<string | null>(null);
  registerSuccess = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private authService = inject(AuthService);

  async register(): Promise<void> {
    if (this.email() && !this.isLoading()) {
      this.isLoading.set(true);
      this.registerError.set(null);
      this.registerSuccess.set(false);

      try {
        const success = await this.authService.register(this.email());
        
        if (success) {
          this.registerSuccess.set(true);
        } else {
          this.registerError.set('El correo electrónico ya está en uso o no es válido.');
        }
      } catch (error) {
        this.registerError.set('Ocurrió un error durante el registro.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}