export interface RegisterRequest {
  nombreUsuario: string;
  apellidoUsuario: string;
  correoInstitucional: string;
  codigoInstitucional: string;
  contrasena: string;
  rol: { idRol: number }; 
  sede: { idSede: number };
  carrera: { idCarrera: number };
}