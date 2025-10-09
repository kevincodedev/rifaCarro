// src/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el AuthService
  const authService = inject(AuthService);
  const authToken = authService.authToken();

  // Si hay un token, clonamos la petición y añadimos la cabecera de autorización
  if (authToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(clonedRequest);
  }

  // Si no hay token, dejamos pasar la petición original
  return next(req);
};