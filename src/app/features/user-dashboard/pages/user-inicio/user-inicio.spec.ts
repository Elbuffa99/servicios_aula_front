import { TestBed } from '@angular/core/testing';
import { UserInicioComponent } from './user-inicio';

describe('UserInicioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInicioComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserInicioComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
