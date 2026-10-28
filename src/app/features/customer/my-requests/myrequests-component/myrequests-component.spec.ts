import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyrequestsComponent } from './myrequests-component';

describe('MyrequestsComponent', () => {
  let component: MyrequestsComponent;
  let fixture: ComponentFixture<MyrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyrequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyrequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
