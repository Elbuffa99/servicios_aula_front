import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAulas } from './admin-aulas';

describe('AdminAulas', () => {
  let component: AdminAulas;
  let fixture: ComponentFixture<AdminAulas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAulas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAulas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
