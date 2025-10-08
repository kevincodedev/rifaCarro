import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // For now, it just passes the request through.
  // In the future, this is where we'll add authentication headers.
  const clonedRequest = req.clone();
  return next(clonedRequest);
};
