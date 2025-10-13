// src/components/login/login.component.ts

import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  email = signal('');
  password = signal('');

  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  async login(): Promise<void> {
    if (this.email() && this.password()) {
      const success = await this.authService.login(this.email(), this.password());
      if (!success) {
        this.toastr.error('Correo o contraseña incorrectos.');
      }
    }
  }
}