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
  nroDocumentoIdentidad = signal<string>('');
  ticketCount = signal<number>(0);
  facturas = signal<Factura[]>([]);

  ngOnInit(): void {
    const documentId = this.authService.userEmail();
    if (documentId) {
      this.facturaService.getFacturaByDocumentId(documentId).subscribe({
        next: (facturas: Factura[]) => {
          if (facturas.length > 0) {
            this.fullName.set(facturas[0].cliente.nombreCompleto);
            this.nroDocumentoIdentidad.set(facturas[0].cliente.nroDocumentoIdentidad);
            const totalTickets = facturas.reduce((sum, f) => sum + f.tickets, 0);
            this.ticketCount.set(totalTickets);
            this.facturas.set(facturas);
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