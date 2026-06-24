export interface Rol {
  idRol: number;
  nombreRol?: string;
}

export interface Sede {
  idSede: number;
  nombreSede?: string;
}

export interface Carrera {
  idCarrera: number;
  nombreCarrera?: string;
}

export interface Usuario {
  idUsuario?: number; 
  nombreUsuario: string;
  apellidoUsuario: string;
  correoInstitucional: string;
  codigoInstitucional: string;
  
  rol: Rol;
  sede: Sede;
  carrera?: Carrera; 
  adminSedeCheck?: Usuario;
}