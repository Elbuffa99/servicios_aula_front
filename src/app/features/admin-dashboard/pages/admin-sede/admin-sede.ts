import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard';
import { Sede } from '../../../../model/sede.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-sede',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sede.html',
  styleUrl: './admin-sede.css'
})
export class AdminSedeComponent implements OnInit {
  private service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  lista: Sede[] = [];
  mostrarModal = false;
  procesando = false;
  filtroBusqueda = '';
  paginaActual = 1;
  itemsPorPagina = 10;
  
  form: Sede = { nombreSede: '', direccionSede: '' } as Sede;

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listarSedes().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  get paginados(): Sede[] {
    const filtrados = this.lista.filter(s => 
      s.nombreSede.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return filtrados
      .sort((a, b) => a.nombreSede.localeCompare(b.nombreSede))
      .slice(inicio, inicio + this.itemsPorPagina);
  }

  onBusquedaChange() { this.paginaActual = 1; }

guardar() {
  if (!this.form.nombreSede || !this.form.direccionSede) {
    Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
    return;
  }

  this.procesando = true;

  const obs = this.form.idSede 
    ? this.service.actualizarSede(this.form.idSede, this.form)
    : this.service.registrarSede(this.form);

  obs.subscribe({
    next: () => {
      this.mostrarModal = false;
      this.procesando = false;
      
      this.service.listarSedes().subscribe(data => {
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

  abrir(item?: Sede) {
    this.form = item ? { ...item } : { nombreSede: '', direccionSede: '' } as Sede;
    this.mostrarModal = true;
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    Swal.fire({ 
      title: '¿Eliminar esta sede?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#004a99'
    }).then(res => { 
      if(res.isConfirmed) this.service.eliminarSede(id).subscribe(() => this.cargar()); 
    });
  }
}