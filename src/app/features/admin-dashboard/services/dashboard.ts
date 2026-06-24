import { Injectable } from '@angular/core';
import { HttpClient,HttpParams} from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; 
import { ResumenReporte } from '../../../model/resumen-reporte.model';
import { Reserva } from '../../../model/reserva.model';
import { Aula } from '../../../model/aula.model';
import { Sede } from '../../../model/sede.model';
import { TipoAula } from '../../../model/tipo-aula.model';
import { Carrera } from '../../../model/carrera.model';
import { Usuario } from '../../../model/usuario.models';
import { Clases } from '../../../model/clases.model';
import { Horario } from '../../../model/horario.model';
import { ReservaIntegrante } from '../../../model/reserva-integrante';
import { Incidencia } from '../../../model/incidencia.model';
import { ReporteSemanal } from '../../../model/reporte-semanal.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  private actualizarSource = new Subject<void>();
  actualizar$ = this.actualizarSource.asObservable();

  constructor(private http: HttpClient) {}

  notificarCambio() {
    this.actualizarSource.next();
  }

  getResumen(): Observable<ResumenReporte> {
    return this.http.get<ResumenReporte>(`${this.apiUrl}/reportes/resumen-general`);
  }
  
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas`);
  }

  listarAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas`);
  }

  registrarAula(aula: Aula): Observable<any> {
    return this.http.post(`${this.apiUrl}/aulas`, aula);
  }

  eliminarAula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/aulas/${id}`);
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  listarCarreras(): Observable<Carrera[]> {
     return this.http.get<Carrera[]>(`${this.apiUrl}/carreras`); 
    }

  registrarCarrera(carrera: Carrera): Observable<any> {
     return this.http.post(`${this.apiUrl}/carreras`, carrera); 
    }

  actualizarCarrera(id: number, carrera: Carrera): Observable<any> {
     return this.http.put(`${this.apiUrl}/carreras/${id}`, carrera); 
    }

  eliminarCarrera(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/carreras/${id}`); 
    }

  listarSedes(): Observable<Sede[]> {
     return this.http.get<Sede[]>(`${this.apiUrl}/sedes`); 
    }

  registrarSede(sede: Sede): Observable<any> {
     return this.http.post(`${this.apiUrl}/sedes`, sede); 
    }

  actualizarSede(id: number, sede: Sede): Observable<any> {
     return this.http.put(`${this.apiUrl}/sedes/${id}`, sede); 
    }

  eliminarSede(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/sedes/${id}`); 
    }

  listarTiposAula(): Observable<TipoAula[]> {
     return this.http.get<TipoAula[]>(`${this.apiUrl}/tipos-aula`); 
    }

  registrarTipoAula(tipo: TipoAula): Observable<any> {
     return this.http.post(`${this.apiUrl}/tipos-aula`, tipo); 
    }

  actualizarTipoAula(id: number, tipo: TipoAula): Observable<any> {
     return this.http.put(`${this.apiUrl}/tipos-aula/${id}`, tipo); 
    }

  eliminarTipoAula(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/tipos-aula/${id}`); 
    }

  listarRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  listarClases(): Observable<Clases[]> {
     return this.http.get<Clases[]>(`${this.apiUrl}/clases`); 
    }

  registrarClases(clase: Clases): Observable<any> {
     return this.http.post(`${this.apiUrl}/clases`, clase); 
    }

  actualizarClases(id: number, clase: Clases): Observable<any> {
     return this.http.put(`${this.apiUrl}/clases/${id}`, clase); 
    }

  eliminarClases(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/clases/${id}`); 
    }

  listarHorarios(): Observable<Horario[]> {
     return this.http.get<Horario[]>(`${this.apiUrl}/horarios`); 
    }

  registrarHorario(horario: Horario): Observable<any> {
    return this.http.post(`${this.apiUrl}/horarios`, horario);
  }

  actualizarHorario(id: number, horario: Horario): Observable<any> {
    return this.http.put(`${this.apiUrl}/horarios/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/horarios/${id}`);
  }


  filtrarReservas(fecha?: string, idSede?: number, estado?: string): Observable<Reserva[]> {
    let params = new HttpParams();
    if (fecha) params = params.set('fecha', fecha);
    if (idSede) params = params.set('idSede', idSede.toString());
    if (estado) params = params.set('estado', estado);
    
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas/filtrar`, { params });
  }


  aprobarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservas/${id}/aprobar`, {});
  }

  rechazarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservas/${id}/rechazar`, {});
  }

  listarIntegrantes(): Observable<ReservaIntegrante[]> {
    return this.http.get<ReservaIntegrante[]>(`${this.apiUrl}/reservas-integrantes`);
  }

  listarIntegrantesPorReserva(idReserva: number): Observable<ReservaIntegrante[]> {
    return this.http.get<ReservaIntegrante[]>(`${this.apiUrl}/reservas-integrantes?idReserva=${idReserva}`);
  }

listarIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/incidencias`);
  }

  // Reportes y Analíticas (Dashboard)
  getTopUsuarios(top: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/top-usuarios?top=${top}`);
  }

  getOcupacionPorHorario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/ocupacion-por-horario`);
  }

  getSedesDemanda(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/sedes-demanda`);
  }

  getAulasMasUsadas(top: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/aulas-mas-usadas?top=${top}`);
  }

  getReservasPorEstado(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/reservas-por-estado`);
  }

  getReservasPorDia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/reservas-por-dia`);
  }

  listarReportesSemanales(): Observable<ReporteSemanal[]> {
    return this.http.get<ReporteSemanal[]>(`${this.apiUrl}/reportes-semanales`);
  }

  guardarRegistroReporteSemanal(reporte: ReporteSemanal): Observable<any> {
    return this.http.post(`${this.apiUrl}/reportes-semanales`, reporte);
  }

}