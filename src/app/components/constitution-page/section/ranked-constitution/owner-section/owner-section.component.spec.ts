import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankedOwnerSectionComponent } from './owner-section.component';

describe('OwnerSectionComponent', () => {
  let component: RankedOwnerSectionComponent;
  let fixture: ComponentFixture<RankedOwnerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankedOwnerSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankedOwnerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
