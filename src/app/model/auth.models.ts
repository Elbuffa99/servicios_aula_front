export interface LoginRequest {
  correoInstitucional: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  idUsuario: number;
  correoInstitucional: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  rol: string;
}