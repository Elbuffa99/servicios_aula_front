import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard';
import { UserDashboard } from './features/user-dashboard/user-dashboard';
import { AdminInicioComponent } from './features/admin-dashboard/pages/admin-inicio/admin-inicio';
import { AdminAulas } from './features/admin-dashboard/pages/admin-aulas/admin-aulas';
import { AdminHistorial} from './features/admin-dashboard/pages/admin-historial/admin-historial';
import { AdminReservas} from './features/admin-dashboard/pages/admin-reservas/admin-reservas';
import { AdminSedeComponent} from './features/admin-dashboard/pages/admin-sede/admin-sede';
import { AdminTipoAula} from './features/admin-dashboard/pages/admin-tipo-aula/admin-tipo-aula';
import { AdminUsuariosComponent} from './features/admin-dashboard/pages/admin-usuarios/admin-usuarios';
import { AdminCarreras} from './features/admin-dashboard/pages/admin-carreras/admin-carreras';
import { AdminClases} from './features/admin-dashboard/pages/admin-clases/admin-clases';
import { AdminHorarios } from './features/admin-dashboard/pages/admin-horarios/admin-horarios';
import { UserInicioComponent } from './features/user-dashboard/pages/user-inicio/user-inicio';
import { UserMisReservasComponent } from './features/user-dashboard/pages/user-mis-reservas/user-mis-reservas';
import { UserNuevaReservaComponent } from './features/user-dashboard/pages/user-nueva-reserva/user-nueva-reserva';
import { UserIncidenciasComponent } from './features/user-dashboard/pages/user-incidencias/user-incidencias';


export const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { 
    path: 'admin-dashboard', 
    component: AdminDashboard,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: AdminInicioComponent },
      { path: 'aulas', component: AdminAulas },
      { path: 'historial', component: AdminHistorial},
      { path: 'carreras', component: AdminCarreras}, 
      { path: 'reservas', component: AdminReservas },
      { path: 'sede', component: AdminSedeComponent },
      { path: 'tipo-aula', component: AdminTipoAula },
      { path: 'usuarios', component: AdminUsuariosComponent },
      { path: 'clases', component: AdminClases },
      { path: 'horarios', component: AdminHorarios },
    ]
  },
    {
    path: 'user-dashboard',
    component: UserDashboard,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: UserInicioComponent },
      { path: 'mis-reservas', component: UserMisReservasComponent },
      { path: 'nueva-reserva', component: UserNuevaReservaComponent },
      { path: 'reportar-incidencia', component: UserIncidenciasComponent },
    ]
  },
];