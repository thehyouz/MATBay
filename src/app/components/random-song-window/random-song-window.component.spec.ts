import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSongWindowComponent } from './random-song-window.component';

describe('RandomSongWindowComponent', () => {
  let component: RandomSongWindowComponent;
  let fixture: ComponentFixture<RandomSongWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomSongWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomSongWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
