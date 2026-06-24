import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LoginResponse } from '../../model/auth.models';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserSidebarComponent],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  usuario: LoginResponse | null = null;
  dropdownOpen = false;
  sidebarOpen = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.usuario = this.authService.getUsuarioLogueado();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Estás seguro que deseas salir de tu cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
