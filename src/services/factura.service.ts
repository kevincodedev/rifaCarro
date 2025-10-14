import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface Factura {
  id: number;
  numero: string;
  fecha: string;
  hora: string;
  monto: string;
  montoMin: string;
  tasa: string;
  print: number;
  tickets: number;
  cliente: {
    id: number;
    tipoDocumentoIdentidad: string;
    nroDocumentoIdentidad: string;
    nombreCompleto: string;
    fotoCedula: string;
  };
  local: {
    id: number;
    nombre: string;
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
