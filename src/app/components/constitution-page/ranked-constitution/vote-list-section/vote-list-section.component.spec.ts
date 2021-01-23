import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteListSectionComponent } from './vote-list-section.component';

describe('VoteListSectionComponent', () => {
  let component: VoteListSectionComponent;
  let fixture: ComponentFixture<VoteListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
