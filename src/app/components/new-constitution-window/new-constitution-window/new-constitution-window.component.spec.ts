import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConstitutionWindowComponent } from './new-constitution-window.component';

describe('NewConstitutionWindowComponent', () => {
  let component: NewConstitutionWindowComponent;
  let fixture: ComponentFixture<NewConstitutionWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConstitutionWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewConstitutionWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
