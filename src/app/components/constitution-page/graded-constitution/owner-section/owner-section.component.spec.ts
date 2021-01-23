import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedOwnerSectionComponent } from './owner-section.component';

describe('OwnerSectionComponent', () => {
  let component: GradedOwnerSectionComponent;
  let fixture: ComponentFixture<GradedOwnerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedOwnerSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedOwnerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
