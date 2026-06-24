import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSede } from './admin-sede';

describe('AdminSede', () => {
  let component: AdminSede;
  let fixture: ComponentFixture<AdminSede>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSede],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSede);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
