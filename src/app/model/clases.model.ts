import { Aula } from './aula.model';
import { Horario } from './horario.model';

export interface Clases {
  idClases?: number;
  nombreCurso: string;
  diaSemana: string;
  aula: Aula;
  horario: Horario;
}