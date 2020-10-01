import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstitutionsHistoryPageComponent } from './constitutions-history-page.component';

describe('ConstitutionHistoryPageComponent', () => {
  let component: ConstitutionsHistoryPageComponent;
  let fixture: ComponentFixture<ConstitutionsHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstitutionsHistoryPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstitutionsHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
