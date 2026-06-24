import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { TipoAula } from '../../../../model/tipo-aula.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-tipo-aula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tipo-aula.html',
  styleUrl: './admin-tipo-aula.css'
})
export class AdminTipoAula implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  lista: TipoAula[] = [];
  mostrarModal = false;
  procesando = false;
  filtroBusqueda = '';
  paginaActual = 1;
  itemsPorPagina = 10;
  form: TipoAula = { descripcion: '' } as TipoAula;

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listarTiposAula().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  get paginados(): TipoAula[] {
    const filtrados = this.lista.filter(t => 
      t.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return filtrados
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
      .slice(inicio, inicio + this.itemsPorPagina);
  }

  onBusquedaChange() { this.paginaActual = 1; }

  guardar() {
    if (!this.form.descripcion?.trim()) {
      Swal.fire('Error', 'La descripción es obligatoria', 'error');
      return;
    }

    this.procesando = true;
    const obs = this.form.idTipoAula 
      ? this.service.actualizarTipoAula(this.form.idTipoAula, this.form)
      : this.service.registrarTipoAula(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarModal = false;
        
        this.service.listarTiposAula().subscribe(data => {
          this.lista = data;
          this.procesando = false;
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

  abrir(item?: TipoAula) {
    this.form = item ? { ...item } : { descripcion: '' } as TipoAula;
    this.mostrarModal = true;
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    Swal.fire({ 
      title: '¿Eliminar este registro?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#004a99'
    }).then(res => { 
      if(res.isConfirmed) {
        this.service.eliminarTipoAula(id).subscribe(() => this.cargar()); 
      }
    });
  }
}