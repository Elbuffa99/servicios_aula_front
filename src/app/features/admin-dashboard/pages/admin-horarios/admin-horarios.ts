import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { Horario } from '../../../../model/horario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-horarios.html',
  styleUrl: './admin-horarios.css'
})
export class AdminHorarios implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  
  lista: Horario[] = [];
  listaFiltrada: Horario[] = [];
  
  paginaActual = 1;
  porPagina = 10;
  filtroTurno = '';
  
  mostrarModal = false;
  procesando = false;
  form: Horario = this.crearVacio();

  ngOnInit() { 
    this.cargar(); 
  }

  cargar() {
    this.service.listarHorarios().subscribe(data => {
      this.lista = data || [];
      this.filtrar();
    });
  }

  crearVacio(): Horario {
    return { horaInicio: '08:00', horaSalida: '09:00', turno: 'MAÑANA' } as Horario;
  }

  filtrar() {
    this.listaFiltrada = this.filtroTurno 
      ? this.lista.filter(h => h.turno === this.filtroTurno) 
      : [...this.lista];
    
    this.paginaActual = 1;
    this.cdr.detectChanges();
  }

  get paginados() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.listaFiltrada.slice(inicio, inicio + this.porPagina);
  }

  validarHorario(): string | null {
    const inicio = parseInt(this.form.horaInicio.split(':')[0]);
    const salida = parseInt(this.form.horaSalida.split(':')[0]);

    if (isNaN(inicio) || isNaN(salida)) return "Debe ingresar horas válidas.";
    if (inicio >= salida) return "La hora de inicio debe ser menor a la hora de salida.";
    if (inicio < 6 || salida > 23) return "El rango permitido es de 06:00 a 23:00.";
    
    if (this.form.turno === 'MAÑANA' && (inicio < 6 || inicio >= 12)) return "El turno MAÑANA es de 06:00 a 12:00.";
    if (this.form.turno === 'TARDE' && (inicio < 12 || inicio >= 18)) return "El turno TARDE es de 12:00 a 18:00.";
    if (this.form.turno === 'NOCHE' && (inicio < 18 || inicio >= 23)) return "El turno NOCHE es de 18:00 a 23:00.";
    
    return null;
  }

  guardar() {
   
    const error = this.validarHorario();
    if (error) {
      Swal.fire('Error', error, 'error');
      return;
    }


    const existeDuplicado = this.lista.some(h => 
      h.horaInicio === this.form.horaInicio && 
      h.horaSalida === this.form.horaSalida &&
      h.idHorario !== this.form.idHorario 
    );

    if (existeDuplicado) {
      Swal.fire('Atención', 'Ya existe un horario configurado con este rango de tiempo.', 'warning');
      return;
    }

    this.procesando = true;
    const obs = this.form.idHorario 
      ? this.service.actualizarHorario(this.form.idHorario, this.form)
      : this.service.registrarHorario(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarModal = false;
        this.procesando = false;
        
        this.service.listarHorarios().subscribe(data => {
          this.lista = data || [];
          this.filtrar();
          Swal.fire('Éxito', 'Guardado correctamente', 'success');
        });
      },
      error: () => {
        this.procesando = false;
        Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
      }
    });
  }

  abrir(item?: Horario) {
    this.form = item ? { ...item } : this.crearVacio();
    this.mostrarModal = true;
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#004a99' })
      .then(res => { 
        if (res.isConfirmed) {
          this.service.eliminarHorario(id).subscribe(() => this.cargar()); 
        }
      });
  }
}