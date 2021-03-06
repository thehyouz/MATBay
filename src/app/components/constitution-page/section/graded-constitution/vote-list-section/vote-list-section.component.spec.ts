import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedVoteListSectionComponent } from './vote-list-section.component';

describe('VoteListSectionComponent', () => {
  let component: GradedVoteListSectionComponent;
  let fixture: ComponentFixture<GradedVoteListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedVoteListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedVoteListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
