import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFlowService {
  userEmail = signal<string | null>(null);
  idCardPhoto = signal<Blob | null>(null);

constructor(protected http: HttpClient,
   ) {
    console.log(this.idCardPhoto);
   }

  canAccessRegistrationFlow(): boolean {
    return !!this.userEmail();
  }

  add(formData: any) {
    return this.http.post(`${environment.apiUrl}/user`, formData);
  }

  addPhoto(id: number) {
    const formData = new FormData();
    const photo = this.idCardPhoto();
    if (photo) {
      formData.append('photo', photo);
    }
    console.log(formData);
    return this.http.post(`${environment.apiUrl}/user/upload/photo/${id}`, formData);
  }
  
  resetFlow(): void {
    this.userEmail.set(null);
    this.idCardPhoto.set(null);
  }
}