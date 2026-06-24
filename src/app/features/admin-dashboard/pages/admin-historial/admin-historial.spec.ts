import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistorial } from './admin-historial';

describe('AdminHistorial', () => {
  let component: AdminHistorial;
  let fixture: ComponentFixture<AdminHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHistorial],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
