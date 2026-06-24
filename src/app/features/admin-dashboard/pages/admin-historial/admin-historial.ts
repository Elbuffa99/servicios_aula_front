import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../../../core/services/auth'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-historial.html',
  styleUrls: ['./admin-historial.css']
})
export class AdminHistorial implements OnInit {
  tabActive: 'reportes' | 'reservas' | 'incidencias' = 'reportes';
  resumen: any = null;
  reservas: any[] = [];
  incidencias: any[] = [];
  usuarioActual: any = null;

  pRes: number = 1;
  pInc: number = 1;
  porPagina: number = 5;

  constructor(
    private dashboardService: DashboardService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioLogueado();
    this.cargarDatos();
  }

  changeTab(tab: 'reportes' | 'reservas' | 'incidencias') { this.tabActive = tab; }

  get reservasPaginadas() {
    return this.reservas.slice((this.pRes - 1) * this.porPagina, this.pRes * this.porPagina);
  }
  
  get incidenciasPaginadas() {
    return this.incidencias.slice((this.pInc - 1) * this.porPagina, this.pInc * this.porPagina);
  }

  cargarDatos() {
    this.dashboardService.getResumen().subscribe(data => { this.resumen = data; this.cdr.detectChanges(); });
    this.dashboardService.getReservas().subscribe(data => { this.reservas = data; this.cdr.detectChanges(); });
    this.dashboardService.listarIncidencias().subscribe(data => { this.incidencias = data; this.cdr.detectChanges(); });
  }

async exportarPDF() {
    const hoy = new Date();
    const { isConfirmed } = await Swal.fire({
      title: 'Generar Reporte',
      text: '¿Deseas exportar el informe semanal completo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#004a99'
    });
    if (!isConfirmed) return;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 74, 153);
    doc.text('CIBERTEC - INFORME SEMANAL', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Fecha: ${hoy.toLocaleDateString()}`, 14, 28);
    doc.text(`Generado por: ${this.usuarioActual?.nombreUsuario || 'Admin'}`, 14, 33);
    doc.text(`Correo Institucional: ${this.usuarioActual?.correoInstitucional || 'N/A'}`, 14, 38);
    doc.text(`Sede: ${this.usuarioActual?.sede || 'Lima Centro'}`, 14, 43);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('RESUMEN GENERAL', 14, 55);
    

doc.setFontSize(11);
doc.text(`Total: ${this.resumen?.totalReservas || 0}`, 14, 65);
doc.text(`Aprobadas: ${this.resumen?.reservasAprobadas || 0}`, 70, 65);
doc.text(`Pendientes: ${this.resumen?.reservasPendientes || 0}`, 130, 65);
doc.text(`Rechazadas: ${this.resumen?.reservasRechazadas || 0}`, 14, 72);
doc.text(`Canceladas: ${this.resumen?.reservasCanceladas || 0}`, 70, 72);
    doc.setFontSize(14);
    doc.text('LISTADO DE INCIDENCIAS', 14, 90);

    autoTable(doc, {
      startY: 95,
      head: [['Fecha', 'Usuario', 'Aula', 'Asunto']],
      body: this.incidencias.map(inc => [
        new Date(inc.fechaReporte).toLocaleDateString(),
        `${inc.usuario?.nombreUsuario || ''}`,
        inc.aula?.codigoAula || 'N/A',
        inc.asunto || 'Sin asunto'
      ]),
      headStyles: { fillColor: [0, 74, 153], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.text('Sistema de Gestión Académica - Cibertec © 2026', 14, 290);

    doc.save(`Informe_Semanal_${hoy.toLocaleDateString().replace(/\//g, '-')}.pdf`);
  }
}