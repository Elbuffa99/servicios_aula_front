import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth'; 
import { LoginResponse } from '../../model/auth.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  admin: LoginResponse | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.admin = this.authService.getUsuarioLogueado();
  }
}