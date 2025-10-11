import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFlowService {
  userEmail = signal<string | null>(null);
  idCardPhoto = signal<string | null>(null);

constructor(protected http: HttpClient,
   ) {
   }

  canAccessRegistrationFlow(): boolean {
    return !!this.userEmail();
  }

  add(formData: any) {
    return this.http.post(`${environment.apiUrl}/user`, formData);
  }

  addPhoto(id: number) {
    const formData = { photo: this.idCardPhoto() }
    return this.http.post(`${environment.apiUrl}/user/upload/photo/${id}`, formData);
  }
  
  resetFlow(): void {
    this.userEmail.set(null);
    this.idCardPhoto.set(null);
  }
}