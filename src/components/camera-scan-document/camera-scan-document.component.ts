import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private readonly registrationFlowService = inject(RegistrationFlowService);

  showPreview = signal(false);
  cameraError = signal<string | null>(null);
  private stream: MediaStream | null = null;

  async ngOnInit() {
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
  
    canvas.toBlob((blob) => {
      if (blob) {
        // Guardamos el Blob en el servicio para que el formulario la pueda usar.
        this.registrationFlowService.idCardPhoto.set(blob);
        //UploadFile
        console.log("Foto de documento guardada en el servicio como Blob.");
        // Navegamos al formulario del sorteo.
        console.log(blob);
        this.router.navigate(['/raffle']);
      }
    }, 'image/jpeg');
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}