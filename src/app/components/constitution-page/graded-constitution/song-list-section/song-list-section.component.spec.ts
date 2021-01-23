import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedSongListSectionComponent } from './song-list-section.component';

describe('SongListSectionComponent', () => {
  let component: GradedSongListSectionComponent;
  let fixture: ComponentFixture<GradedSongListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedSongListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedSongListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
