import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { DashboardService } from '../admin-dashboard/services/dashboard';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Sede } from '../../model/sede.model';
import { Carrera } from '../../model/carrera.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  dashboardService = inject(DashboardService);
  router = inject(Router);
  
  hidePassword = true;
  listaSedes: Sede[] = [];
  listaCarreras: Carrera[] = [];
  usuario = {
    nombreUsuario: '',
    apellidoUsuario: '',
    correoInstitucional: '',
    codigoInstitucional: '',
    contrasena: '',
    rol: { idRol: 2 }, 
    sede: { idSede: 0 },
    carrera: { idCarrera: 1 }
  };

  ngOnInit() {
  this.cargarSedes();
  this.cargarCarreras(); 
}

  cargarSedes() {
    this.dashboardService.listarSedes().subscribe({
      next: (data) => {
        this.listaSedes = data;
      },
      error: (err) => {
        console.error('Error al cargar las sedes:', err);
      }
    });
  }
  cargarCarreras() {
  this.dashboardService.listarCarreras().subscribe({
    next: (data) => {
      this.listaCarreras = data;
    },
    error: (err) => console.error('Error al cargar carreras:', err)
  });
}

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onRegister() {
    if (!this.usuario.nombreUsuario || !this.usuario.apellidoUsuario || 
        !this.usuario.correoInstitucional || !this.usuario.codigoInstitucional || 
        !this.usuario.contrasena || this.usuario.sede.idSede === 0) {
      
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, llena todos los datos, incluyendo tu sede.',
        confirmButtonColor: '#002d72'
      });
      return; 
    }

    if (this.usuario.contrasena.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        confirmButtonColor: '#002d72'
      });
      return;
    }

    const correo = this.usuario.correoInstitucional.toLowerCase();
    const codigo = this.usuario.codigoInstitucional.toLowerCase();
    
    if (!correo.includes(codigo)) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo no coincide',
        text: 'El correo institucional debe contener tu código de alumno.',
        confirmButtonColor: '#002d72'
      });
      return;
    }

    const registroData = {
      ...this.usuario,
      sede: { idSede: Number(this.usuario.sede.idSede) }
    };

    this.authService.registrar(registroData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Tu cuenta ha sido creada correctamente.',
          confirmButtonColor: '#002d72'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Error del backend:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un problema al crear la cuenta. Verifica si el código o correo ya están registrados.',
          confirmButtonColor: '#002d72'
        });
      }
    });
  }
}