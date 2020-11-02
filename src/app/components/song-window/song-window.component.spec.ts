import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongWindowComponent } from './song-window.component';

describe('SongWindowComponent', () => {
  let component: SongWindowComponent;
  let fixture: ComponentFixture<SongWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
