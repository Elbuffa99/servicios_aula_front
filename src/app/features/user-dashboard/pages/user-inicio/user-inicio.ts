import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserReservaService } from '../../services/reserva';
import { Reserva } from '../../../../model/reserva.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-user-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-inicio.html',
  styleUrls: ['./user-inicio.css']
})
export class UserInicioComponent implements OnInit {
  private reservaService = inject(UserReservaService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  authService = inject(AuthService);

  reservas: Reserva[] = [];
  cargando = true;

  get pendientes(): number {
    return this.reservas.filter(r => r.estadoReserva.descripcion?.toUpperCase() === 'PENDIENTE').length;
  }

  get confirmadas(): number {
    return this.reservas.filter(r => r.estadoReserva.descripcion?.toUpperCase() === 'CONFIRMADA').length;
  }

  get canceladas(): number {
    return this.reservas.filter(r => r.estadoReserva.descripcion?.toUpperCase() === 'CANCELADA').length;
  }

  get ultimasReservas(): Reserva[] {
    return this.reservas.slice(0, 5);
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.reservaService.getMisReservas().subscribe({
      next: (data) => {
        // Normalizar estado a mayúsculas igual que admin-inicio
        this.reservas = data.map(r => ({
          ...r,
          estadoReserva: {
            ...r.estadoReserva,
            descripcion: r.estadoReserva.descripcion?.toUpperCase() || 'DESCONOCIDO'
          }
        })).sort((a, b) => b.idReserva - a.idReserva);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando mis reservas:', err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  irAMisReservas() {
    this.router.navigate(['/user-dashboard/mis-reservas']);
  }

  getBadgeClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'CONFIRMADA': return 'badge confirmada';
      case 'PENDIENTE': return 'badge pendiente';
      case 'CANCELADA': return 'badge cancelada';
      case 'RECHAZADA': return 'badge rechazada';
      default: return 'badge';
    }
  }
}
