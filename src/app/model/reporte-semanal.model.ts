import { Usuario } from './usuario.models';

export interface ReporteSemanal {
    idReporte?: number;
    fechaGeneracion: string;
    fechaInicioSemana: string;
    fechaFinSemana: string;
    totalReservas: number;
    admin: Usuario;
}