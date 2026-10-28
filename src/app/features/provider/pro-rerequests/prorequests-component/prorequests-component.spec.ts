import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProrequestsComponent } from './prorequests-component';

describe('ProrequestsComponent', () => {
  let component: ProrequestsComponent;
  let fixture: ComponentFixture<ProrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProrequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProrequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
