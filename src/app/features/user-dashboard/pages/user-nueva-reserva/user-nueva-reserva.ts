import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserReservaService } from '../../services/reserva';
import { AuthService } from '../../../../core/services/auth';
import { Aula } from '../../../../model/aula.model';
import { Sede } from '../../../../model/sede.model';
import { Horario, TipoReserva, NuevaReservaRequest } from '../../../../model/horario.model';
import { ReservaIntegrante } from '../../../../model/reserva-integrante'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-nueva-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-nueva-reserva.html',
  styleUrls: ['./user-nueva-reserva.css']
})
export class UserNuevaReservaComponent implements OnInit {
  private reservaService = inject(UserReservaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  sedes: Sede[] = [];
  todasLasAulas: Aula[] = [];
  aulasFiltradas: Aula[] = [];
  horarios: Horario[] = [];
  tiposReserva: TipoReserva[] = [];

  mostrarModalGrupal = false;
  listaIntegrantes: ReservaIntegrante[] = [];
  cargandoCatalogos = true;
  procesando = false;

  readonly fechaMinima: string = new Date().toISOString().split('T')[0];
  
  get fechaMaxima(): string {
    const f = new Date(); 
    f.setDate(f.getDate() + 7);
    return f.toISOString().split('T')[0];
  }

  form = {
    fechaReserva: '',
    idSede: '' as any,
    idAula: '' as any,
    idHorario: '' as any,
    idTipoReserva: '' as any,
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargandoCatalogos = true;
    forkJoin({
      sedes: this.reservaService.listarSedes(),
      aulas: this.reservaService.listarAulas(),
      horarios: this.reservaService.listarHorarios(),
      tipos: this.reservaService.listarTiposReserva()
    }).subscribe({
      next: (res) => {
        this.sedes = res.sedes;
        this.todasLasAulas = res.aulas;
        this.horarios = res.horarios;
        this.tiposReserva = res.tipos;
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoCatalogos = false;
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
      }
    });
  }

  onSedeChange() {
    this.form.idAula = '';
    this.aulasFiltradas = this.form.idSede ? this.todasLasAulas.filter(a => a.sede?.idSede === Number(this.form.idSede)) : [];
  }

  agregarIntegrante() {
    this.listaIntegrantes.push({ codigoAlumno: '', nombreAlumno: '', reserva: { idReserva: 0 } });
  }

  // NUEVA FUNCIÓN: Permite remover un compañero de la lista por su índice
  eliminarIntegrante(index: number) {
    this.listaIntegrantes.splice(index, 1);
    // Si elimina todos, por usabilidad le dejamos uno vacío listo para rellenar
    if (this.listaIntegrantes.length === 0) {
      this.agregarIntegrante();
    }
    this.cdr.detectChanges();
  }

  validar(): string | null {
    if (!this.form.fechaReserva) return 'Selecciona una fecha.';
    
    if (this.form.fechaReserva < this.fechaMinima || this.form.fechaReserva > this.fechaMaxima) {
        return 'La fecha de reserva debe estar dentro del rango de una semana desde hoy.';
    }

    if (!this.form.idSede) return 'Selecciona una sede.';
    if (!this.form.idAula) return 'Selecciona un aula.';
    if (!this.form.idHorario) return 'Selecciona un horario.';
    if (!this.form.idTipoReserva) return 'Selecciona el motivo de reserva.';
    return null;
  }

  guardar() {
    const error = this.validar();
    if (error) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos o inválidos', text: error });
      return;
    }

    if (Number(this.form.idTipoReserva) === 1) { 
      if (this.listaIntegrantes.length === 0) this.agregarIntegrante();
      this.mostrarModalGrupal = true;
      this.cdr.detectChanges(); 
    } else {
      this.ejecutarReserva([]);
    }
  }

  ejecutarReserva(integrantes: ReservaIntegrante[] = []) {
    const usuario = this.authService.getUsuarioLogueado();
    if (!usuario) {
      Swal.fire('Error', 'No se pudo verificar la sesión del usuario.', 'error');
      return;
    }

    this.procesando = true;

    // Buscamos los datos completos de los catálogos locales para saltar los @NotNull del Back
    const aulaSeleccionada = this.todasLasAulas.find(a => a.idAula === Number(this.form.idAula));
    const sedeSeleccionada = this.sedes.find(s => s.idSede === Number(this.form.idSede));
    const horarioSeleccionado = this.horarios.find(h => h.idHorario === Number(this.form.idHorario));
    const tipoSeleccionado = this.tiposReserva.find(t => t.idTipoReserva === Number(this.form.idTipoReserva));

    const body: any = {
      fechaReserva: this.form.fechaReserva,
      usuario: {
        idUsuario: usuario.idUsuario,
        nombreUsuario: usuario.nombreUsuario || 'Usuario',
        apellidoUsuario: usuario.apellidoUsuario || 'Cibertec'
      },
      aula: {
        idAula: Number(this.form.idAula),
        codigoAula: aulaSeleccionada ? aulaSeleccionada.codigoAula : 'AULA-N'
      },
      sede: {
        idSede: Number(this.form.idSede),
        nombreSede: sedeSeleccionada ? sedeSeleccionada.nombreSede : 'SEDE-N'
      },
      horario: {
        idHorario: Number(this.form.idHorario),
        horaInicio: horarioSeleccionado ? horarioSeleccionado.horaInicio : '00:00',
        horaSalida: horarioSeleccionado ? horarioSeleccionado.horaSalida : '00:00'
      },
      estadoReserva: {
        idEstadoReserva: 1,
        descripcion: 'PENDIENTE'
      },
      tipoReserva: {
        idTipoReserva: Number(this.form.idTipoReserva),
        descripcion: tipoSeleccionado ? tipoSeleccionado.descripcion : 'RESERVA'
      }
    };

    this.reservaService.crearReserva(body).subscribe({
      next: (reservaCreada: any) => {
        
        if (integrantes && integrantes.length > 0) {
          const peticiones = integrantes.map(i => {
            const integrantePayload = {
              codigoAlumno: i.codigoAlumno,
              nombreAlumno: i.nombreAlumno,
              reserva: { idReserva: Number(reservaCreada.idReserva) }
            };
            return this.reservaService.registrarIntegrantes(integrantePayload as any);
          });

          forkJoin(peticiones).subscribe({
            next: () => this.finalizar(),
            error: (err) => { 
              console.error('Error al registrar integrantes:', err);
              this.procesando = false; 
              Swal.fire('Reserva Incompleta', 'Se creó la reserva, pero falló el registro de los integrantes.', 'warning'); 
              this.cdr.detectChanges(); 
            }
          });

        } else {
          this.finalizar();
        }
      },
      error: (err) => { 
        console.error('Error al crear reserva principal:', err);
        this.procesando = false; 
        
        // Manejo amigable si salta la validación del Back de los 2 horarios máximos por día
        let msg = 'No se pudo registrar la reserva. El aula podría estar ocupada.';
        if (err.error && err.error.body && err.error.body[0]) {
            msg = err.error.body[0].message;
        }
        
        Swal.fire('Operación rechazada', msg, 'error'); 
        this.cdr.detectChanges(); 
      }
    });
  }

  finalizar() {
    this.procesando = false;
    this.mostrarModalGrupal = false;
    this.listaIntegrantes = []; 
    Swal.fire('¡Éxito!', 'La reserva se ha registrado correctamente.', 'success')
      .then(() => this.router.navigate(['/user-dashboard/mis-reservas']));
  }

  cancelar() { 
    this.router.navigate(['/user-dashboard/inicio']); 
  }
}