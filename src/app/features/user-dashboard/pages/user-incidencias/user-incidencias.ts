import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserReservaService } from '../../services/reserva';
import { IncidenciaService } from '../../services/incidencia';
import { AuthService } from '../../../../core/services/auth';
import { Reserva } from '../../../../model/reserva.model';
import Swal from 'sweetalert2';

interface AulaOpcion {
  idAula: number;
  codigoAula: string;
}

@Component({
  selector: 'app-user-incidencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-incidencias.html',
  styleUrls: ['./user-incidencias.css']
})
export class UserIncidenciasComponent implements OnInit {
  private reservaService = inject(UserReservaService);
  private incidenciaService = inject(IncidenciaService);
  private authService = inject(AuthService);

  aulasUnicas: AulaOpcion[] = [];
  cargando = true;
  procesando = false;
  submitted = false;

  form = {
    idAula: '' as number | '',
    asunto: '',
    descripcion: '',
  };

  errors: { idAula?: string; asunto?: string; descripcion?: string } = {};

  ngOnInit() {
    this.reservaService.getMisReservas().subscribe({
      next: (reservas: Reserva[]) => {
        // Extraer aulas únicas de las reservas del usuario
        const mapaAulas = new Map<number, string>();
        reservas.forEach(r => {
          if (r.aula?.idAula && r.aula?.codigoAula) {
            mapaAulas.set(r.aula.idAula, r.aula.codigoAula);
          }
        });
        this.aulasUnicas = Array.from(mapaAulas.entries()).map(([id, cod]) => ({
          idAula: id,
          codigoAula: cod
        }));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar tus aulas de reserva.', confirmButtonColor: '#004a99' });
      }
    });
  }

  validar(): boolean {
    this.errors = {};
    let valido = true;

    if (!this.form.idAula) {
      this.errors.idAula = 'Selecciona el aula donde ocurrió la incidencia.';
      valido = false;
    }
    if (!this.form.asunto.trim() || this.form.asunto.trim().length < 3) {
      this.errors.asunto = 'El asunto debe tener al menos 3 caracteres.';
      valido = false;
    }
    if (this.form.asunto.trim().length > 100) {
      this.errors.asunto = 'El asunto no puede superar los 100 caracteres.';
      valido = false;
    }
    if (!this.form.descripcion.trim() || this.form.descripcion.trim().length < 5) {
      this.errors.descripcion = 'La descripción debe tener al menos 5 caracteres.';
      valido = false;
    }
    if (this.form.descripcion.trim().length > 1000) {
      this.errors.descripcion = 'La descripción no puede superar los 1000 caracteres.';
      valido = false;
    }

    return valido;
  }

  enviar() {
    this.submitted = true;
    if (!this.validar()) return;

    const usuario = this.authService.getUsuarioLogueado();
    if (!usuario) {
      Swal.fire({ icon: 'error', title: 'Sesión expirada', text: 'Inicia sesión nuevamente.', confirmButtonColor: '#004a99' });
      return;
    }

    // Formato requerido por el backend: "yyyy-MM-dd HH:mm:ss"
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fechaReporte = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    this.procesando = true;
    this.incidenciaService.crearIncidencia({
      asunto: this.form.asunto.trim(),
      descripcion: this.form.descripcion.trim(),
      fechaReporte,
      usuario: { idUsuario: usuario.idUsuario },
      aula: { idAula: Number(this.form.idAula) }
    }).subscribe({
      next: () => {
        this.procesando = false;
        Swal.fire({
          icon: 'success',
          title: '¡Incidencia reportada!',
          text: 'Tu reporte fue enviado correctamente al equipo de soporte.',
          confirmButtonColor: '#004a99',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.resetForm();
        });
      },
      error: (err) => {
        this.procesando = false;
        const msg = err?.error?.body?.[0]?.message || 'No se pudo enviar la incidencia. Intenta de nuevo.';
        Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#004a99' });
      }
    });
  }

  resetForm() {
    this.form = { idAula: '', asunto: '', descripcion: '' };
    this.errors = {};
    this.submitted = false;
  }

  get asuntoLength(): number {
    return this.form.asunto.length;
  }

  get descripcionLength(): number {
    return this.form.descripcion.length;
  }
}
