export interface ReservaIntegrante {
  idReservaIntegrante?: number;
  codigoAlumno: string;
  nombreAlumno: string;
  reserva: { 
    idReserva: number 
  };
}