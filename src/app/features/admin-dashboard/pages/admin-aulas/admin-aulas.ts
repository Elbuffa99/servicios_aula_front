import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { DashboardService } from '../../services/dashboard';
import { Aula } from '../../../../model/aula.model';
import { Sede } from '../../../../model/sede.model';
import { TipoAula } from '../../../../model/tipo-aula.model';
import Swal from 'sweetalert2'; 
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-aulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-aulas.html',
  styleUrl: './admin-aulas.css',
})
export class AdminAulas implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  
  listaAulas: Aula[] = [];
  aulasMostradas: Aula[] = [];
  sedes: Sede[] = [];
  tiposAula: TipoAula[] = [];
  
  mostrarModal = false;
  esEdicion = false;
  procesando = false;
  filtroBusqueda = '';
  
  // Paginación
  paginaActual = 1;
  itemsPorPagina = 10;
  
  aulaForm: any = { 
    codigoAula: '', capacidad: 0, 
    sede: { idSede: '' }, tipoAula: { idTipoAula: '' } 
  };

  get aulasPaginadas(): Aula[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.aulasMostradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.aulasMostradas.length / this.itemsPorPagina);
  }

  ngOnInit() {
    this.cargarDatosIniciales();
    this.dashboardService.actualizar$.subscribe(() => this.cargarAulas());
  }

  cargarDatosIniciales() {
    forkJoin({
      sedes: this.dashboardService.listarSedes(),
      tipos: this.dashboardService.listarTiposAula()
    }).subscribe(res => {
      this.sedes = res.sedes;
      this.tiposAula = res.tipos;
      this.cargarAulas();
    });
  }

  cargarAulas() {
    this.dashboardService.listarAulas().subscribe(data => {
      this.listaAulas = data.sort((a, b) => a.codigoAula.localeCompare(b.codigoAula)).map(aula => ({
        ...aula,
        tipoAula: this.tiposAula.find(t => t.idTipoAula === aula.tipoAula?.idTipoAula) ?? aula.tipoAula,
        sede: this.sedes.find(s => s.idSede === aula.sede?.idSede) ?? aula.sede
      }));
      this.filtrar();
      this.cdr.detectChanges();
    });
  }

  filtrar() {
    this.aulasMostradas = this.listaAulas.filter(a => 
      a.codigoAula.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    this.paginaActual = 1;
  }

  cambiarPagina(num: number) {
    if (num >= 1 && num <= this.totalPaginas) this.paginaActual = num;
  }

guardarAula() {

    if (this.aulaForm.capacidad < 10) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'La capacidad mínima debe ser 10.', confirmButtonColor: '#004a99' });
      return;
    }


    const existe = this.listaAulas.find(a => 
      a.codigoAula.trim().toLowerCase() === this.aulaForm.codigoAula.trim().toLowerCase() 
      && a.idAula !== this.aulaForm.idAula // Se ignora si es el mismo registro en edición
    );

    if (existe) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Atención', 
        text: 'Ya existe un aula con ese mismo código.', 
        confirmButtonColor: '#004a99' 
      });
      return;
    }

    this.procesando = true;
    this.dashboardService.registrarAula(this.aulaForm).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.procesando = false;
        this.dashboardService.notificarCambio();
        setTimeout(() => {
          Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Aula guardada.', confirmButtonColor: '#004a99', timer: 2000 });
        }, 150);
      },
      error: () => {
        this.procesando = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor.', confirmButtonColor: '#004a99' });
      }
    });
  }

  abrirModal(aula?: any) {
    this.esEdicion = !!aula;
    this.aulaForm = aula ? JSON.parse(JSON.stringify(aula)) : { 
      codigoAula: '', capacidad: 0, sede: { idSede: '' }, tipoAula: { idTipoAula: '' } 
    };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }

  eliminar(id: number) {
    Swal.fire({ title: '¿Estás seguro?', text: "No podrás revertir esto", icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' })
    .then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.eliminarAula(id).subscribe(() => this.dashboardService.notificarCambio());
      }
    });
  }
}