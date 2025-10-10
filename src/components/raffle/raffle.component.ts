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
  
  // Señales para los selects dinámicos
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
      pais: [1, Validators.required], // Hardcodeado a Venezuela (1)
      estado: [null, Validators.required],
      ciudad: [null, Validators.required], // Cambiado de 'parish' a 'ciudad'
      direccion: ['', Validators.required],
      telefonos: this.fb.array([this.createPhoneGroup()]) // Usamos un FormArray
    });

    // Cargar los estados
    this.loadStates();
  }

  // Helper para acceder al FormArray de teléfonos
  get telefonos(): FormArray {
    return this.raffleForm.get('telefonos') as FormArray;
  }

  // Crea un nuevo FormGroup para un teléfono
  createPhoneGroup(): FormGroup {
    return this.fb.group({
      numero: ['', Validators.required]
    });
  }

  loadStates(): void {
    this.locationService.getStatesByCountry(1).subscribe(states => {
      this.allStates.set(states);
    });
  }

  onStateChange(event: Event): void {
    const stateId = (event.target as HTMLSelectElement).value;
    const selectedState = this.allStates().find(s => s.id === +stateId);
    this.citiesOfSelectedState.set(selectedState ? selectedState.ciudades : []);
    this.raffleForm.get('ciudad')?.setValue(null); // Resetea la ciudad al cambiar de estado
  }

  async submitForm(): Promise<void> {
    if (this.raffleForm.invalid) {
      this.raffleForm.markAllAsTouched();
      return;
    }

    const formValue = this.raffleForm.value;
    const photoDataUrl = this.registrationFlowService.idCardPhoto();
    
    // Construimos el payload final
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
      telefono: formValue.telefonos, // El FormArray ya tiene el formato correcto [{numero: '...'}]
      roles: [{ rol: "ROLE_ANALISTA" }], // Valor fijo como en el ejemplo
      sexo: formValue.sexo,
      direccion: formValue.direccion,
      pais: formValue.pais,
      estado: +formValue.estado, // Asegurarse que sea número
      ciudad: +formValue.ciudad, // Asegurarse que sea número
      // Aquí se enviaría la foto. Por ahora, solo tenemos el DataURL.
      // fotoCedula: this.dataURLtoFile(photoDataUrl!, 'cedula.jpg'),
    };
    
    console.log('Payload a enviar:', payload);

    // Aquí iría la llamada a la API para enviar el formulario.
    // await this.http.post('...', payload).toPromise();

    // Limpiamos el flujo y navegamos al perfil
    this.registrationFlowService.resetFlow();
    this.router.navigate(['/profile']); // Redirige al perfil al finalizar
  }
}