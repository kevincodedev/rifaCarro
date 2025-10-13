import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacturaService, Factura } from '../../services/factura.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  facturaService = inject(FacturaService);

  fullName = signal<string>('');
  ticketCount = signal<number>(0);

  ngOnInit(): void {
    const documentId = this.authService.userEmail();
    if (documentId) {
      this.facturaService.getFacturaByDocumentId(documentId).subscribe({
        next: (facturas: Factura[]) => {
          if (facturas.length > 0) {
            this.fullName.set(facturas[0].cliente.nombreCompleto);
            const totalTickets = facturas.reduce((sum, f) => sum + f.tickets, 0);
            this.ticketCount.set(totalTickets);
          }
        },
        error: (err) => console.error('Error fetching factura:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}