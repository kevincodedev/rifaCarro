import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RegistrationFlowService } from '../../services/registration-flow.service';

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

  isLoading = signal<boolean>(false);

  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private registrationFlowService = inject(RegistrationFlowService);

  async register(): Promise<void> {
    if (this.email() && !this.isLoading()) {
      this.isLoading.set(true);
      this.registerError.set(null);


      try {
        const response = await this.authService.register(this.email());

        if (response && response.success) {
          if (response.msg) {
            this.toastr.success(response.msg);
          }
          this.registrationFlowService.setCanAccessEmailSent(true);
          this.router.navigate(['/email-sent']);
        } else {
          if (response && response.email_registered) {
            this.toastr.error(
              'Este correo electrónico ya está registrado. Por favor, utiliza otro.'
            );
          } else {
            this.registerError.set(response?.msg || 'Ocurrió un error durante el registro.');
          }
        }
      } catch (error) {
        this.registerError.set('Ocurrió un error durante el registro.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}