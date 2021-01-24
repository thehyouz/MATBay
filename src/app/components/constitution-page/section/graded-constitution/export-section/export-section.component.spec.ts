import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedExportSectionComponent } from './export-section.component';

describe('ExportSectionComponent', () => {
  let component: GradedExportSectionComponent;
  let fixture: ComponentFixture<GradedExportSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedExportSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedExportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
