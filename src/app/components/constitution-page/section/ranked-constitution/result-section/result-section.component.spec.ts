import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankedResultSectionComponent } from './result-section.component';

describe('RankedResultSectionComponent', () => {
  let component: RankedResultSectionComponent;
  let fixture: ComponentFixture<RankedResultSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankedResultSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankedResultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
