import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTipoAula } from './admin-tipo-aula';

describe('AdminTipoAula', () => {
  let component: AdminTipoAula;
  let fixture: ComponentFixture<AdminTipoAula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTipoAula],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTipoAula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
