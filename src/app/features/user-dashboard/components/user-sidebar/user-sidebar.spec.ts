import { TestBed } from '@angular/core/testing';
import { UserSidebarComponent } from './user-sidebar';

describe('UserSidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSidebarComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserSidebarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
