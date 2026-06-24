import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { Reserva } from '../../../../model/reserva.model';
import { ReservaIntegrante } from '../../../../model/reserva-integrante';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reservas.html',
  styleUrl: './admin-reservas.css'
})
export class AdminReservas implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  lista: Reserva[] = [];
  listaIntegrantes: ReservaIntegrante[] = []; 
  paginaActual = 1;
  porPagina = 5;
  filtroEstado = '';
  mostrarModalIntegrantes = false; 

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.getReservas().subscribe(data => {
      this.lista = data.sort((a, b) => 
        new Date(a.fechaReserva).getTime() - new Date(b.fechaReserva).getTime()
      );
      this.cdr.detectChanges();
    });
  }

  aplicarFiltros() {
    if (!this.filtroEstado) {
      this.cargar();
      return;
    }
    this.service.filtrarReservas(undefined, undefined, this.filtroEstado)
      .subscribe(data => {
        this.lista = data;
        this.paginaActual = 1;
        this.cdr.detectChanges();
      });
  }

  get paginados() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.lista.slice(inicio, inicio + this.porPagina);
  }

  cambiarEstado(r: Reserva, accion: 'aprobar' | 'rechazar') {
    const estadoActual = r.estadoReserva.descripcion.toUpperCase();

    if (accion === 'rechazar' && estadoActual === 'APROBADA') {
      Swal.fire({
        icon: 'error',
        title: 'Acción no permitida',
        text: 'No se puede rechazar una reserva que ya ha sido aprobada.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const nombreAccion = (accion === 'aprobar') ? 'aprobado' : 'rechazado';
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar esta reserva como ${nombreAccion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${nombreAccion}r`
    }).then((result) => {
      if (result.isConfirmed) {
        const obs = (accion === 'aprobar') ? this.service.aprobarReserva(r.idReserva) : this.service.rechazarReserva(r.idReserva);
        obs.subscribe(() => {
          Swal.fire('Hecho', `Reserva actualizada a ${nombreAccion}`, 'success');
          this.cargar();
        });
      }
    });
  }

  verIntegrantes(idReserva: number) {
    this.service.listarIntegrantesPorReserva(idReserva).subscribe(data => {
      this.listaIntegrantes = data;
      this.mostrarModalIntegrantes = true;
    });
  }

  esCancelada(r: Reserva): boolean {
    return r?.estadoReserva?.descripcion?.toUpperCase() === 'CANCELADA';
  }
}