import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './user-sidebar.html',
  styleUrls: ['./user-sidebar.css']
})
export class UserSidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  close() {
    this.closeSidebar.emit();
  }

  // Cerrar con ESC
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close();
  }
}
