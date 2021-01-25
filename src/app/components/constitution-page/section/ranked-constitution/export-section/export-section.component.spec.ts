import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankedExportSectionComponent } from './export-section.component';



describe('RankedExportSectionComponent', () => {
  let component: RankedExportSectionComponent;
  let fixture: ComponentFixture<RankedExportSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankedExportSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankedExportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
