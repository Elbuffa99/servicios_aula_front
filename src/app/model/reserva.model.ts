export interface Reserva {
  idReserva: number;
  fechaReserva: string;
  fechaSolicitud: string; 
  usuario: {
    idUsuario: number;
    nombreUsuario: string;
    apellidoUsuario: string;
  };
  aula: {
    idAula: number;
    codigoAula: string;
  };
  sede: { 
    idSede: number;
    nombreSede: string;
  };
  horario: { 
    idHorario: number;
    horaInicio: string;
    horaSalida: string;
  };
  estadoReserva: {
    idEstadoReserva: number;
    descripcion: string;
  };
  tipoReserva: { 
    idTipoReserva: number;
    descripcion: string;
  };
}