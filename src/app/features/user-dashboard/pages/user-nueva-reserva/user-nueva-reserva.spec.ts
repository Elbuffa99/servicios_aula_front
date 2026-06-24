import { TestBed } from '@angular/core/testing';
import { UserNuevaReservaComponent } from './user-nueva-reserva';

describe('UserNuevaReservaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNuevaReservaComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserNuevaReservaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
