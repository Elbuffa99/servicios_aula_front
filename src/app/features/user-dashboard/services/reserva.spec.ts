import { TestBed } from '@angular/core/testing';
import { UserReservaService } from './reserva';

describe('UserReservaService', () => {
  let service: UserReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
