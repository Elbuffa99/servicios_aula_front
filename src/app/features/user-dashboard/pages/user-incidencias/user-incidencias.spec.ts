import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIncidencias } from './user-incidencias';

describe('UserIncidencias', () => {
  let component: UserIncidencias;
  let fixture: ComponentFixture<UserIncidencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIncidencias],
    }).compileComponents();

    fixture = TestBed.createComponent(UserIncidencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
