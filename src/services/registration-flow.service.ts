import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFlowService {
  userEmail = signal<string | null>(null);
  
  idCardPhoto = signal<string | null>(null);

  canAccessRegistrationFlow(): boolean {
    return !!this.userEmail();
  }

  resetFlow(): void {
    this.userEmail.set(null);
    this.idCardPhoto.set(null);
  }
}