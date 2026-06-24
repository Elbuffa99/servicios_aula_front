import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClases } from './admin-clases';

describe('AdminClases', () => {
  let component: AdminClases;
  let fixture: ComponentFixture<AdminClases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClases],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClases);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
