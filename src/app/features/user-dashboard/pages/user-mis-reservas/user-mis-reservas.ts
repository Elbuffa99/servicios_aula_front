import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserReservaService } from '../../services/reserva';
import { Reserva } from '../../../../model/reserva.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-mis-reservas.html',
  styleUrls: ['./user-mis-reservas.css']
})
export class UserMisReservasComponent implements OnInit {
  private reservaService = inject(UserReservaService);
  private cdr = inject(ChangeDetectorRef);

  listaReservas: Reserva[] = [];
  reservasMostradas: Reserva[] = [];
  filtroEstado = 'TODAS';
  cargando = true;
  procesando = false;

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 10;

  readonly estados = ['TODAS', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'RECHAZADA'];

  get reservasPaginadas(): Reserva[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.reservasMostradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.reservasMostradas.length / this.itemsPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.cargando = true;
    this.reservaService.getMisReservas().subscribe({
      next: (data) => {
        this.listaReservas = data.map(r => ({
          ...r,
          estadoReserva: {
            ...r.estadoReserva,
            descripcion: r.estadoReserva.descripcion?.toUpperCase() || 'DESCONOCIDO'
          }
        })).sort((a, b) => b.idReserva - a.idReserva);
        this.filtrar();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar() {
    if (this.filtroEstado === 'TODAS') {
      this.reservasMostradas = [...this.listaReservas];
    } else {
      this.reservasMostradas = this.listaReservas.filter(
        r => r.estadoReserva.descripcion === this.filtroEstado
      );
    }
    this.paginaActual = 1;
  }

  cambiarPagina(num: number) {
    if (num >= 1 && num <= this.totalPaginas) this.paginaActual = num;
  }

  puedeCanselar(r: Reserva): boolean {
    return r.estadoReserva.descripcion === 'PENDIENTE';
  }

  cancelar(r: Reserva) {
    Swal.fire({
      title: '¿Cancelar reserva?',
      html: `Aula <strong>${r.aula.codigoAula}</strong> — ${r.fechaReserva}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.procesando = true;
      this.reservaService.cancelarReserva(r.idReserva).subscribe({
        next: () => {
          this.procesando = false;
          Swal.fire({
            icon: 'success',
            title: 'Reserva cancelada',
            timer: 2000,
            showConfirmButton: false
          });
          this.cargarReservas();
        },
        error: (err) => {
          this.procesando = false;
          const msg = err?.error?.body?.[0]?.message || 'No se pudo cancelar la reserva.';
          Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#004a99' });
        }
      });
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'CONFIRMADA': return 'badge confirmada';
      case 'PENDIENTE':  return 'badge pendiente';
      case 'CANCELADA':  return 'badge cancelada';
      case 'RECHAZADA':  return 'badge rechazada';
      default:           return 'badge';
    }
  }
}
