import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../services/dashboard';
import { Clases } from '../../../../model/clases.model';
import { Aula } from '../../../../model/aula.model';
import { Horario } from '../../../../model/horario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-clases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-clases.html',
  styleUrl: './admin-clases.css'
})
export class AdminClases implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  lista: Clases[] = [];
  listaAulas: Aula[] = [];
  listaHorarios: Horario[] = [];
  diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  mostrarModal = false;
  procesando = false;
  filtroBusqueda = '';
  paginaActual = 1;
  itemsPorPagina = 10;
  form: Clases = this.crearObjetoVacio();

  ngOnInit() {
    this.cargarTodo();
  }

  crearObjetoVacio(): Clases {
    return { idClases: undefined, nombreCurso: '', diaSemana: 'LUNES', aula: {} as Aula, horario: {} as Horario } as Clases;
  }

  // Carga todo simultáneamente para evitar errores de referencia nula
  cargarTodo() {
    forkJoin({
      clases: this.service.listarClases(),
      aulas: this.service.listarAulas(),
      horarios: this.service.listarHorarios()
    }).subscribe({
      next: (res) => {
        this.listaAulas = res.aulas;
        this.listaHorarios = res.horarios;
        // Mapeo para asegurar que los objetos de la clase tengan la referencia completa
        this.lista = res.clases.map(c => ({
          ...c,
          aula: this.listaAulas.find(a => a.idAula === c.aula?.idAula) || c.aula,
          horario: this.listaHorarios.find(h => h.idHorario === c.horario?.idHorario) || c.horario
        }));
        this.cdr.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los datos', 'error')
    });
  }

  get paginados(): Clases[] {
    return this.lista
      .filter(c => c.nombreCurso.toLowerCase().includes(this.filtroBusqueda.toLowerCase()))
      .slice((this.paginaActual - 1) * this.itemsPorPagina, this.paginaActual * this.itemsPorPagina);
  }

  guardar() {
    if (!this.form.nombreCurso || !this.form.aula?.idAula || !this.form.horario?.idHorario) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const existe = this.lista.some(c => 
      c.diaSemana === this.form.diaSemana && 
      c.horario.idHorario === this.form.horario.idHorario && 
      c.aula.idAula === this.form.aula.idAula && 
      c.idClases !== this.form.idClases
    );

    if (existe) {
      Swal.fire('Conflicto', 'Horario o Aula ya ocupados.', 'warning');
      return;
    }

    this.procesando = true;
    (this.form.idClases ? this.service.actualizarClases(this.form.idClases, this.form) : this.service.registrarClases(this.form))
      .subscribe({
        next: () => {
          this.mostrarModal = false;
          this.procesando = false;
          this.cargarTodo();
          Swal.fire('Éxito', 'Guardado correctamente', 'success');
        },
        error: () => { this.procesando = false; Swal.fire('Error', 'No se pudo guardar', 'error'); }
      });
  }

  abrir(item?: Clases) {
    this.form = item ? JSON.parse(JSON.stringify(item)) : this.crearObjetoVacio();
    this.mostrarModal = true;
  }

  cancelar() { this.mostrarModal = false; this.form = this.crearObjetoVacio(); }

  eliminar(id: number | undefined) {
    if (!id) return;
    Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) this.service.eliminarClases(id).subscribe(() => this.cargarTodo());
    });
  }

  compararAulas = (a1: Aula, a2: Aula) => a1?.idAula === a2?.idAula;
  compararHorarios = (h1: Horario, h2: Horario) => h1?.idHorario === h2?.idHorario;
}