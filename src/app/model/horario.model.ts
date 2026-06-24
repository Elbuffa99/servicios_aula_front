export interface Horario {
  idHorario?: number;
  horaInicio: string; 
  horaSalida: string;
  turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
}
export interface EstadoReserva {
  idEstadoReserva?: number;
  descripcion: string;
}

export interface TipoReserva {
  idTipoReserva?: number;
  descripcion: string;
}

export interface NuevaReservaRequest {
  fechaReserva: string;            // yyyy-MM-dd
  usuario: { idUsuario: number };
  aula: { idAula: number };
  sede: { idSede: number };
  horario: { idHorario: number };
  estadoReserva: { idEstadoReserva: number };  // 1 = PENDIENTE
  tipoReserva: { idTipoReserva: number };
}
