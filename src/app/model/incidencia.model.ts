export interface Incidencia {
  idIncidencia?: number;
  asunto: string;
  descripcion: string;
  fechaReporte: string; 
  usuario: { idUsuario: number };
  aula: { idAula: number; codigoAula?: string };
}

export interface NuevaIncidenciaRequest {
  asunto: string;
  descripcion: string;
  fechaReporte: string;
  usuario: { idUsuario: number };
  aula: { idAula: number };
}
