import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSectionComponent } from './result-section.component';

describe('ResultSectionComponent', () => {
  let component: ResultSectionComponent;
  let fixture: ComponentFixture<ResultSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
