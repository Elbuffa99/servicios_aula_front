import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  isMobileMenuOpen = false;

 constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

logout() {
    Swal.fire({
      title: '¿Salir?',
      icon: 'warning',
      confirmButtonColor: '#002d72',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamamos al servicio para limpiar todo
        this.authService.logout(); 
        this.router.navigate(['/login']);
      }
    });
  }
}