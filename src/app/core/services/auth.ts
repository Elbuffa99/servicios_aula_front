import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../model/auth.models';
import { RegisterRequest } from '../../model/register.models';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

// En tu AuthServic
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      // Guardamos el objeto completo
      localStorage.setItem('auth_data', JSON.stringify(response));
      // Guardamos el token separado para que el interceptor lo encuentre
      localStorage.setItem('token', response.token); 
    })
  );
}

  registrar(usuario: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  getUsuarioLogueado(): LoginResponse | null {
    const authData = localStorage.getItem('auth_data');
    return authData ? JSON.parse(authData) : null;
  }

  logout(): void {
    localStorage.removeItem('auth_data');
  localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_data');
  }
}