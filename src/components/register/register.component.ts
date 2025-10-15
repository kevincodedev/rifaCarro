import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  private router = inject(Router);

  async register(): Promise<void> {
    if (this.email() && !this.isLoading()) {
      this.isLoading.set(true);
      this.registerError.set(null);
      this.registerSuccess.set(false);

      try {
        const response = await this.authService.register(this.email());

        if (response && response.email_registered) {
          if (response.success) {
            this.toastr.success(response.msg);
          } else {
            this.toastr.error(
              'Este correo electrónico ya está registrado. Por favor, utiliza otro.'
            );
          }
        } else {
          this.registerSuccess.set(true);
          this.router.navigate(['/login']);
        }
      } catch (error) {
        this.registerError.set('Ocurrió un error durante el registro.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}