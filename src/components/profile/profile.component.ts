import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacturaService, Factura } from '../../services/factura.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  authService = inject(AuthService);
  facturaService = inject(FacturaService);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  fullName = signal<string>('');
  nroDocumentoIdentidad = signal<string>('');
  ticketCount = signal<number>(0);
  facturas = signal<Factura[]>([]);
  hasFacturas = signal<boolean>(false);

  ngOnInit(): void {
    const email = this.authService.userEmail();
    if (email) {
      this.facturaService.getFacturaByEmail(email).subscribe({
        next: (response: any) => {
          if (Array.isArray(response) && response.length > 0) {
            this.hasFacturas.set(true);
            this.fullName.set(response[0].cliente.nombreCompleto);
            this.nroDocumentoIdentidad.set(response[0].cliente.nroDocumentoIdentidad);
            const totalTickets = response.reduce((sum, f) => sum + f.tickets, 0);
            this.ticketCount.set(totalTickets);
            this.facturas.set(response);
          } else {
            this.hasFacturas.set(false);
          }
        },
        error: (err) => {
          console.error('Error fetching factura:', err);
          this.hasFacturas.set(false);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}