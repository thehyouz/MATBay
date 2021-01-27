import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedSongWindowComponent } from './song-window.component';

describe('GradedSongWindowComponent', () => {
  let component: GradedSongWindowComponent;
  let fixture: ComponentFixture<GradedSongWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradedSongWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradedSongWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
