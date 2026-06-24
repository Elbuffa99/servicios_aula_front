import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { Usuario } from '../../../../model/usuario.models';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuariosComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  listaUsuarios: Usuario[] = [];
  usuariosMostradas: Usuario[] = [];
  roles: any[] = [];
  sedes: any[] = [];
  carreras: any[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;

  mostrarModal = false;
  procesando = false;
  filtroBusqueda = '';

  usuarioForm: any = {};

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.usuariosMostradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosMostradas.length / this.itemsPorPagina);
  }

  ngOnInit() {
    this.cargarDatosIniciales();
    this.dashboardService.actualizar$.subscribe(() => this.cargarUsuarios());
  }

cargarDatosIniciales() {
  forkJoin({ 
    roles: this.dashboardService.listarRoles(),
    sedes: this.dashboardService.listarSedes(),
    carreras: this.dashboardService.listarCarreras()
  }).subscribe(res => {
    this.roles = res.roles;
    this.sedes = res.sedes; 
    this.carreras = res.carreras;
    this.cargarUsuarios();
  });
}

  cargarUsuarios() {
    this.dashboardService.listarUsuarios().subscribe(data => {
      this.listaUsuarios = data;
      this.filtrar();
      this.cdr.detectChanges();
    });
  }

  filtrar() {
    this.usuariosMostradas = this.listaUsuarios.filter(u => 
      u.nombreUsuario.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      u.correoInstitucional.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    this.paginaActual = 1;
  }

guardarUsuario() {

  if (!this.usuarioForm.nombreUsuario || !this.usuarioForm.apellidoUsuario || 
      !this.usuarioForm.correoInstitucional || !this.usuarioForm.codigoInstitucional) {
    Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
    return;
  }

  const inicioCorreo = this.usuarioForm.correoInstitucional.split('@')[0];
  if (this.usuarioForm.codigoInstitucional !== inicioCorreo) {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: `El código institucional (${this.usuarioForm.codigoInstitucional}) no coincide con el inicio del correo (${inicioCorreo})`,
      confirmButtonColor: '#004a99'
    });
    return; 
  }

  const usuarioParaEnviar = { ...this.usuarioForm };
  
  usuarioParaEnviar.contrasena = usuarioParaEnviar.contrasena || 'tempPassword123';
  
  usuarioParaEnviar.rol = { 
    idRol: Number(this.usuarioForm.rol.idRol) 
  };
  
  usuarioParaEnviar.sede = { 
    idSede: Number(this.usuarioForm.sede.idSede) 
  };
  
  usuarioParaEnviar.carrera = { 
    idCarrera: Number(this.usuarioForm.carrera.idCarrera) 
  };

  this.procesando = true;
  this.dashboardService.actualizarUsuario(usuarioParaEnviar.idUsuario, usuarioParaEnviar).subscribe({
    next: () => {
      this.mostrarModal = false;
      this.procesando = false;
      this.dashboardService.notificarCambio();
      Swal.fire({ 
        icon: 'success', 
        title: 'Éxito', 
        text: 'Usuario actualizado correctamente', 
        confirmButtonColor: '#004a99' 
      });
    },
    error: (err) => {
      this.procesando = false;
      console.error('Error al actualizar:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario. Verifica los datos.',
        confirmButtonColor: '#d33'
      });
    }
  });
}

  abrirModal(usuario: Usuario) {
    this.usuarioForm = JSON.parse(JSON.stringify(usuario));
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }

  eliminar(id: number) {
    Swal.fire({ title: '¿Seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí' })
    .then(res => { if(res.isConfirmed) this.dashboardService.eliminarUsuario(id).subscribe(() => this.dashboardService.notificarCambio()); });
  }

  cambiarPagina(num: number) { this.paginaActual = num; }
}