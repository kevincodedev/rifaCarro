import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTotalTickets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/facturas/tickets/total`);
  }
}
