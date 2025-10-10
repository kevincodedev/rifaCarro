import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { LocationService, State, City } from '../../services/location.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-raffle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RaffleComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly registrationFlowService = inject(RegistrationFlowService);
  private readonly locationService = inject(LocationService);

  raffleForm!: FormGroup;
  idPhotoPreview = signal<SafeUrl | null>(null);
  
  allStates = signal<State[]>([]);
  citiesOfSelectedState = signal<City[]>([]);
  
  ngOnInit(): void {
    const email = this.registrationFlowService.userEmail();
    const photoDataUrl = this.registrationFlowService.idCardPhoto();
    
    if (photoDataUrl) {
      this.idPhotoPreview.set(this.sanitizer.bypassSecurityTrustUrl(photoDataUrl));
    }

    this.raffleForm = this.fb.group({
      tipoDocumentoIdentidad: ['V', Validators.required],
      numeroDocumento: ['', Validators.required],
      email: [email, [Validators.required, Validators.email]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      pais: [1, Validators.required], 
      estado: [null, Validators.required],
      ciudad: [null, Validators.required], 
      direccion: ['', Validators.required],
      telefonos: this.fb.array([this.createPhoneGroup()]) 
    });

    this.loadStates();
  }

  get telefonos(): FormArray {
    return this.raffleForm.get('telefonos') as FormArray;
  }

  createPhoneGroup(): FormGroup {
    return this.fb.group({
      numero: ['', Validators.required]
    });
  }

  loadStates(): void {
    this.locationService.getStatesByCountry(1).subscribe(states => {
    this.allStates.set(states);
    console.log('Estados cargados:', states);
    });
  }

  onStateChange(event: Event): void {
    const stateId = (event.target as HTMLSelectElement).value;
    const selectedState = this.allStates().find(s => s.id === +stateId);
    console.log('Estado seleccionado, objeto:',  selectedState.ciudads  );
    this.citiesOfSelectedState.set(selectedState ? selectedState.ciudads : []);
    this.raffleForm.get('ciudad')?.setValue(null); 
  }

  async submitForm(): Promise<void> {
    if (this.raffleForm.invalid) {
      this.raffleForm.markAllAsTouched();
      return;
    }

    const formValue = this.raffleForm.value;
    const photoDataUrl = this.registrationFlowService.idCardPhoto();
    
    const payload = {
      idStatus: 1,
      numeroDocumento: formValue.numeroDocumento,
      tipoDocumentoIdentidad: formValue.tipoDocumentoIdentidad,
      primerNombre: formValue.primerNombre,
      segundoNombre: formValue.segundoNombre,
      primerApellido: formValue.primerApellido,
      segundoApellido: formValue.segundoApellido,
      fechaNacimiento: formValue.fechaNacimiento,
      email: formValue.email,
      idCargo: 2,
      telefono: formValue.telefonos, 
      roles: [{ rol: "CLIENTE" }], 
      sexo: formValue.sexo,
      direccion: formValue.direccion,
      pais: formValue.pais,
      estado: +formValue.estado, 
      ciudad: +formValue.ciudad, 
    };
    
    console.log('Payload a enviar:', payload);

    this.registrationFlowService.resetFlow();
    this.router.navigate(['/profile']); 
  }
}