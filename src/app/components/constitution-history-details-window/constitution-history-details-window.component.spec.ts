import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstitutionHistoryDetailsWindowComponent } from './constitution-history-details-window.component';

describe('ConstitutionHistoryDetailsWindowComponent', () => {
  let component: ConstitutionHistoryDetailsWindowComponent;
  let fixture: ComponentFixture<ConstitutionHistoryDetailsWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstitutionHistoryDetailsWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstitutionHistoryDetailsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
