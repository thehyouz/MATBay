import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSectionComponent } from './export-section.component';

describe('ExportSectionComponent', () => {
  let component: ExportSectionComponent;
  let fixture: ComponentFixture<ExportSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
