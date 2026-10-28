import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPayoutsComponent } from './admin-payouts-component';

describe('AdminPayoutsComponent', () => {
  let component: AdminPayoutsComponent;
  let fixture: ComponentFixture<AdminPayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPayoutsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPayoutsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
