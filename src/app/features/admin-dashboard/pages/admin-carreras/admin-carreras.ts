import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { Carrera } from '../../../../model/carrera.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-carreras.html',
  styleUrl: './admin-carreras.css'
})
export class AdminCarreras implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  lista: Carrera[] = [];
  mostrarModal = false;
  procesando = false;
  filtroBusqueda = '';
  paginaActual = 1;
  itemsPorPagina = 10;
  form: Carrera = { nombreCarrera: '' } as Carrera;

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listarCarreras().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  get paginados(): Carrera[] {
    const filtrados = this.lista.filter(c => 
      c.nombreCarrera.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return filtrados
      .sort((a, b) => a.nombreCarrera.localeCompare(b.nombreCarrera))
      .slice(inicio, inicio + this.itemsPorPagina);
  }

  onBusquedaChange() { this.paginaActual = 1; }

  guardar() {
    const nombreLimpio = this.form.nombreCarrera?.trim();

    if (!nombreLimpio) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    const existe = this.lista.some(c => 
      c.nombreCarrera.toLowerCase() === nombreLimpio.toLowerCase() && 
      c.idCarrera !== this.form.idCarrera
    );

    if (existe) {
      Swal.fire('Error', 'Ya existe una carrera con este nombre', 'error');
      return;
    }

    this.procesando = true;
    const obs = this.form.idCarrera 
      ? this.service.actualizarCarrera(this.form.idCarrera, this.form)
      : this.service.registrarCarrera(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarModal = false;
        this.procesando = false;
        this.form = { nombreCarrera: '' } as Carrera;

        this.service.listarCarreras().subscribe(data => {
          this.lista = data;
          this.cdr.detectChanges();
          
          Swal.fire('Éxito', 'Operación realizada correctamente', 'success');
        });
      },
      error: () => {
        this.procesando = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudo completar la operación', 'error');
      }
    });
  }

  abrir(item?: Carrera) {
    this.form = item ? { ...item } : { nombreCarrera: '' } as Carrera;
    this.mostrarModal = true;
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    Swal.fire({ 
      title: '¿Eliminar?', 
      text: 'Esta acción no se puede deshacer',
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#004a99'
    }).then(res => { 
      if(res.isConfirmed) {
        this.service.eliminarCarrera(id).subscribe(() => this.cargar());
      }
    });
  }
}