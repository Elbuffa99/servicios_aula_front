import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard'; 
import { ResumenReporte } from '../../../../model/resumen-reporte.model';
import { Reserva } from '../../../../model/reserva.model';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-inicio.html',
  styleUrls: ['./admin-inicio.css']
})
export class AdminInicioComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  stats: ResumenReporte | null = null;
  reservas: Reserva[] = [];

ngOnInit() {
  this.cargarDatos();
  setInterval(() => {
    this.cargarDatos();
  }, 5000);
}

  cargarDatos() {
    this.dashboardService.getResumen().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando resumen:', err)
    });

    this.dashboardService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data.map(r => ({
          ...r,
          estadoReserva: {
            ...r.estadoReserva,
            descripcion: r.estadoReserva.descripcion?.toUpperCase() || 'DESCONOCIDO'
          }
        })).slice(0, 10);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando reservas:', err)
    });
  }
}