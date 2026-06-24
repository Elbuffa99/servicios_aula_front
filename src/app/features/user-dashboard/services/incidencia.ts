import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia, NuevaIncidenciaRequest } from '../../../model/incidencia.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

   private apiUrl = environment.apiUrl; // Local PC
 // private apiUrl = 'http://10.0.1.23:8082';  // Red Local (Móvil)

  constructor(private http: HttpClient) {}

  crearIncidencia(dto: NuevaIncidenciaRequest): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.apiUrl}/incidencias`, dto);
  }
}
