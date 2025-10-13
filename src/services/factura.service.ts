import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface Factura {
  id: number;
  numero: string;
  tickets: number;
  cliente: {
    id: number;
    nombreCompleto: string;
    nroDocumentoIdentidad: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private readonly http = inject(HttpClient);

  getFacturaByDocumentId(documentId: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${environment.apiUrl}/factura/${documentId}`);
  }
}
