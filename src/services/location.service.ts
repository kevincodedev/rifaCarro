import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface State {
  id: number;
  nombre: string;
  ciudads: City[];
}

export interface City {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://bofficesorteosstage.pafar.com.ve/public/api';

  // Usamos shareReplay para cachear la respuesta y no llamar a la API múltiples veces
  private statesCache$: Observable<State[]> | null = null;

  getStatesByCountry(countryId: number): Observable<State[]> {
    if (!this.statesCache$) {
      this.statesCache$ = this.http.get<State[]>(`${this.apiUrl}/estado/pais/${countryId}`).pipe(
        shareReplay(1)
      );
    }
    return this.statesCache$;
  }
}