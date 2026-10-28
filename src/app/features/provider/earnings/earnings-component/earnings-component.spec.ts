import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarningsComponent } from './earnings-component';

describe('EarningsComponent', () => {
  let component: EarningsComponent;
  let fixture: ComponentFixture<EarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EarningsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
