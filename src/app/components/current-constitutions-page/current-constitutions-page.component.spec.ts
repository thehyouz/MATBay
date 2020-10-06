import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentConstitutionsPageComponent } from './current-constitutions-page.component';

describe('CurrentConstitutionsPageComponent', () => {
  let component: CurrentConstitutionsPageComponent;
  let fixture: ComponentFixture<CurrentConstitutionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentConstitutionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentConstitutionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
