import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { RegistrationFlowService } from '../../services/registration-flow.service';

@Component({
  selector: 'app-camera-scan-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-scan-document.component.html',
  styleUrls: ['./camera-scan-document.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraScanDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('cameraFeed') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('photoCanvas') canvasElement?: ElementRef<HTMLCanvasElement>;

  private readonly router = inject(Router);
  // Inyectamos el servicio del flujo de registro
  private readonly registrationFlowService = inject(RegistrationFlowService);

  showPreview = signal(false);
  cameraError = signal<string | null>(null);
  private stream: MediaStream | null = null;

  async ngOnInit() {
    // Al iniciar, el guardián ya ha validado y guardado el email en el servicio.
    // Simplemente iniciamos la cámara.
    await this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    this.showPreview.set(false);
    this.cameraError.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara: ", err);
      this.cameraError.set("No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.");
    }
  }

  capturePhoto() {
    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.showPreview.set(true);
    this.stopCamera();
  }

  async retakePhoto() {
    await this.startCamera();
  }

  confirmPhoto() {
    const canvas = this.canvasElement?.nativeElement;
    if (!canvas) return;

    const photoDataUrl = canvas.toDataURL('image/jpeg');
    
    // Guardamos la foto en el servicio para que el formulario la pueda usar.
    this.registrationFlowService.idCardPhoto.set(photoDataUrl);
    console.log("Foto de documento guardada en el servicio.");
    console.log("photoDataUrl:", photoDataUrl);
    // Navegamos al formulario del sorteo.
    this.router.navigate(['/raffle']);
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}