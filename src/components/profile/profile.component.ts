
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  authService = inject(AuthService);
  
  tickets = signal([
    'Ticket #AB-12345',
    'Ticket #CD-67890',
    'Ticket #EF-11223',
    'Ticket #GH-44556',
    'Ticket #IJ-77889',
    'Ticket #KL-99001',
  ]);

  logout(): void {
    this.authService.logout();
  }
}
