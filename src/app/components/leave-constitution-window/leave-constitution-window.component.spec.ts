import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveConstitutionWindowComponent } from './leave-constitution-window.component';

describe('LeaveConstitutionWindowComponent', () => {
  let component: LeaveConstitutionWindowComponent;
  let fixture: ComponentFixture<LeaveConstitutionWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveConstitutionWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveConstitutionWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
