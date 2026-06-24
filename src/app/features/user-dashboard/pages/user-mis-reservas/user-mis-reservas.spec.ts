import { TestBed } from '@angular/core/testing';
import { UserMisReservasComponent } from './user-mis-reservas';

describe('UserMisReservasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMisReservasComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserMisReservasComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
