import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankedVoteListSectionComponent } from './vote-list-section.component';

describe('RankedVoteListSectionComponent', () => {
  let component: RankedVoteListSectionComponent;
  let fixture: ComponentFixture<RankedVoteListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankedVoteListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankedVoteListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
