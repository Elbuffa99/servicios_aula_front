import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../core/services/auth'; 
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  hidePassword = true; 
  
  loginData = {
    correoInstitucional: '',
    contrasena: ''
  };

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onLogin() {
    if (!this.loginData.correoInstitucional || !this.loginData.contrasena) {
      Swal.fire({ icon: 'warning', title: 'Campos vacíos', text: 'Por favor, ingresa tus credenciales.' });
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        Swal.fire({ icon: 'success', title: 'Bienvenido!', timer: 1500, showConfirmButton: false });
        
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error de acceso', text: 'Correo o contraseña incorrectos.' });
      }
    });
  }
}