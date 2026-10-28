import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageJobsComponent } from './manage-jobs-component';

describe('ManageJobsComponent', () => {
  let component: ManageJobsComponent;
  let fixture: ComponentFixture<ManageJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageJobsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageJobsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
