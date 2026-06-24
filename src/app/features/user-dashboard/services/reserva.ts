import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../../../model/reserva.model';
import { NuevaReservaRequest, Horario, TipoReserva } from '../../../model/horario.model';
import { Aula } from '../../../model/aula.model';
import { Sede } from '../../../model/sede.model';
import { ReservaIntegrante } from '../../../model/reserva-integrante';
import { Incidencia } from '../../../model/incidencia.model'; 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserReservaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMisReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas/mis-reservas`);
  }

  crearReserva(reserva: NuevaReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrl}/reservas`, reserva);
  }

  cancelarReserva(id: number): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.apiUrl}/reservas/${id}/cancelar`, {});
  }

  listarSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}/sedes`);
  }

  listarAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas`);
  }

  listarHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios`);
  }

  listarTiposReserva(): Observable<TipoReserva[]> {
    return this.http.get<TipoReserva[]>(`${this.apiUrl}/tipos-reserva`);
  }

  registrarIntegrantes(integrantes: ReservaIntegrante[]): Observable<ReservaIntegrante[]> {
  return this.http.post<ReservaIntegrante[]>(`${this.apiUrl}/reservas-integrantes`, integrantes);
}
reportarIncidencia(incidencia: Incidencia): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/incidencias/guardar`, incidencia, { headers });
}
}
