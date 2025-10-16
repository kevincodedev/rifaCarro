import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RegistrationFlowService } from '../services/registration-flow.service';

export const emailSentGuard: CanActivateFn = (route, state) => {
  const registrationFlowService = inject(RegistrationFlowService);
  const router = inject(Router);

  if (registrationFlowService.canAccessEmailSent()) {
    return true;
  } else {
    return router.parseUrl('/register');
  }
};
