import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListSectionComponent } from './song-list-section.component';

describe('SongListSectionComponent', () => {
  let component: SongListSectionComponent;
  let fixture: ComponentFixture<SongListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
