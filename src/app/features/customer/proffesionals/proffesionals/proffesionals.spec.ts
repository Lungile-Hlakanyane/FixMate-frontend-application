import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Proffesionals } from './proffesionals';

describe('Proffesionals', () => {
  let component: Proffesionals;
  let fixture: ComponentFixture<Proffesionals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Proffesionals],
    }).compileComponents();

    fixture = TestBed.createComponent(Proffesionals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
