import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
// Fix: Re-added FormGroup to correctly type the form property.
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-raffle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raffle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaffleComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Fix: Declared raffleForm property with its type. It will be initialized in the constructor.
  raffleForm: FormGroup;
  
  documentTypes = ['Venezolana', 'Extranjero', 'Pasaporte'];
  states = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 
    'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 
    'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
  ];

  // Fix: Used constructor injection for FormBuilder to resolve the type inference error.
  constructor(private readonly fb: FormBuilder) {
    this.raffleForm = this.fb.group({
      documentType: ['Venezolana', Validators.required],
      documentNumber: ['', Validators.required],
      email: [this.authService.userEmail(), [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      secondName: [''],
      firstLastName: ['', Validators.required],
      secondLastName: [''],
      state: ['', Validators.required],
      municipality: ['', Validators.required],
      parish: ['', Validators.required],
      address: ['', Validators.required],
      phoneCode: ['+58', Validators.required],
      phoneNumber: ['', Validators.required],
      idPhoto: [null as File | null, Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.raffleForm.patchValue({ idPhoto: file });
    }
  }

  submitForm(): void {
    if (this.raffleForm.valid) {
      const fullName = `${this.raffleForm.value.firstName} ${this.raffleForm.value.firstLastName}`;
      this.authService.saveUserName(fullName);
      this.router.navigate(['/success']);
    } else {
      this.raffleForm.markAllAsTouched();
    }
  }
}
