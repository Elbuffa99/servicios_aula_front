import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

let isHandlingLogout = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        
        if (isHandlingLogout || router.url === '/login') {
          return throwError(() => error);
        }

        isHandlingLogout = true;
        
        localStorage.removeItem('token');
        localStorage.removeItem('auth_data');

        Swal.fire({
          icon: 'info',
          title: 'Sesión Finalizada',
          text: 'Por seguridad tu sesión ha sido cerrada.',
          confirmButtonColor: '#004a99',
          allowOutsideClick: false
        }).then(() => {
          isHandlingLogout = false; 
          router.navigate(['/login']);
        });
      }
      
      return throwError(() => error);
    })
  );
};