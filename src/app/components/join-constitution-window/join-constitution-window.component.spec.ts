import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinConstitutionWindowComponent } from './join-constitution-window.component';

describe('JoinConstitutionWindowComponent', () => {
  let component: JoinConstitutionWindowComponent;
  let fixture: ComponentFixture<JoinConstitutionWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinConstitutionWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinConstitutionWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
