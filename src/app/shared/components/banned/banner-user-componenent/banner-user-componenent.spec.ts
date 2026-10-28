import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerUserComponenent } from './banner-user-componenent';

describe('BannerUserComponenent', () => {
  let component: BannerUserComponenent;
  let fixture: ComponentFixture<BannerUserComponenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerUserComponenent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerUserComponenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
