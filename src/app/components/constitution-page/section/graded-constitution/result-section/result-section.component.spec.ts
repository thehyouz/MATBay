import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedResultSectionComponent } from './result-section.component';

describe('ResultSectionComponent', () => {
  let component: GradedResultSectionComponent;
  let fixture: ComponentFixture<GradedResultSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedResultSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedResultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
