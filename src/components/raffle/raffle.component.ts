import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { LocationService, State, City } from '../../services/location.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

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
  loading = false;
  id: number = 0;
  phoneCodes = ['0414', '0424', '0412', '0422', '0416'];

  constructor(
    private clientService: RegistrationFlowService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    const email = this.registrationFlowService.userEmail();
    //const email = "mendozarangelkevindejesus@gmail.com";
    const photoBlob = this.registrationFlowService.idCardPhoto();

    if (photoBlob instanceof Blob) {
      const objectUrl = URL.createObjectURL(photoBlob);
      this.idPhotoPreview.set(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    }

    this.raffleForm = this.fb.group({
      tipoDocumentoIdentidad: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      email: [email, [Validators.required, Validators.email]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      estado: [null, Validators.required],
      ciudad: [null, Validators.required],
      direccion: ['', Validators.required],
      phoneCode: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    // this.raffleForm = this.fb.group({
    //   tipoDocumentoIdentidad: ['V', Validators.required],
    //   numeroDocumento: ['31654812', Validators.required],
    //   email: [email, [Validators.required, Validators.email]],
    //   primerNombre: ['Kevin', Validators.required],
    //   segundoNombre: [''],
    //   primerApellido: ['Mendoza', Validators.required],
    //   segundoApellido: [''],
    //   estado: [null, Validators.required],
    //   ciudad: [null, Validators.required],
    //   direccion: ['El Paraiso, Caracas', Validators.required],
    //   telefono: ['04241696699', Validators.required]
    // });

    this.loadStates();
  }

  get telefono(): FormArray {
    return this.raffleForm.get('telefono') as FormArray;
  }

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
    this.citiesOfSelectedState.set(selectedState ? selectedState.ciudads : []);
    this.raffleForm.get('ciudad')?.setValue(null);
  }

  async submitForm(): Promise<void> {

    if (this.raffleForm.invalid) {
      this.raffleForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.raffleForm.value;
    const fullPhoneNumber = `${formValue.phoneCode}${formValue.phoneNumber}`;

    const payload = {
      idStatus: 1,
      numeroDocumento: formValue.numeroDocumento,
      tipoDocumentoIdentidad: formValue.tipoDocumentoIdentidad,
      primerNombre: formValue.primerNombre,
      segundoNombre: formValue.segundoNombre,
      primerApellido: formValue.primerApellido,
      segundoApellido: formValue.segundoApellido,
      fechaNacimiento: '1990-01-01',
      email: formValue.email,
      idCargo: 1,
      telefono: [{
        numero: fullPhoneNumber,
      },
      ],
      roles: [{ rol: "CLIENTE" }],
      sexo: '',
      direccion: formValue.direccion,
      pais: 1,
      estado: +formValue.estado,
      ciudad: +formValue.ciudad,
    };


    //this.clientService.addPhoto(28).subscribe()


    this.clientService.add(payload).subscribe({
      next: ((resp) => {

        this.toastrService.success('Información registrada con éxito');
        this.id = (resp as any).id;
      }),
      error: (error) => {
        this.loading = false;
        this.toastrService.error('Error al registrar cliente:', error.error.msg);
      },

      complete: () => {
        this.clientService.addPhoto(this.id).subscribe();
        this.registrationFlowService.resetFlow();
        this.router.navigate(['/profile']);
      }
    });
  }
}
