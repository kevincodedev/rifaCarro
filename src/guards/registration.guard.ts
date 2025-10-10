import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { RegistrationFlowService } from '../services/registration-flow.service';

export const registrationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const registrationFlowService = inject(RegistrationFlowService);
  const router = inject(Router);

  // 1. Revisa si el usuario llega con el parámetro "email" en la URL.
  // Ejemplo: /#/camera-scan?email=usuario@correo.com
  const email = route.queryParamMap.get('email');
  if (email) {
    // Si hay un email, lo guardamos en nuestro servicio y permitimos el acceso.
    registrationFlowService.userEmail.set(email);
    return true;
  }

  // 2. Si ya está en el flujo (ej. pasando de la cámara al formulario),
  // verificamos que el email que guardamos previamente todavía exista.
  if (registrationFlowService.canAccessRegistrationFlow()) {
    return true;
  }
  
  // 3. Si no hay email en la URL ni en el servicio, no tiene permiso.
  router.navigate(['/register']);
  return false;
};