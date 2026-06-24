import { Sede } from './sede.model';
import { TipoAula } from './tipo-aula.model';

export interface Aula {
  idAula?: number;
  codigoAula: string;
  capacidad: number;
  tipoAula: TipoAula; 
  sede: Sede; 
}