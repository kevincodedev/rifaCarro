import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFlowService {
  // Almacena el email del usuario durante el flujo de registro.
  userEmail = signal<string | null>(null);
  
  // Almacena la foto (en formato base64) capturada en el paso de la cámara.
  idCardPhoto = signal<string | null>(null);

  // Verifica si el usuario tiene un email guardado para continuar.
  canAccessRegistrationFlow(): boolean {
    return !!this.userEmail();
  }

  resetFlow(): void {
    this.userEmail.set(null);
    this.idCardPhoto.set(null);
  }
}