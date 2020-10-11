import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstitutionPageComponent } from './constitution-page.component';

describe('ConstitutionPageComponent', () => {
  let component: ConstitutionPageComponent;
  let fixture: ComponentFixture<ConstitutionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstitutionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstitutionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
