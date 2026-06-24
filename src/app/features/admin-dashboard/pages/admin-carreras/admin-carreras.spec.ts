import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCarreras } from './admin-carreras';

describe('AdminCarreras', () => {
  let component: AdminCarreras;
  let fixture: ComponentFixture<AdminCarreras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCarreras],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCarreras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
