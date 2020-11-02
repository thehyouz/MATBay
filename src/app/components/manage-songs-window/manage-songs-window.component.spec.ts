import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSongsWindowComponent } from './manage-songs-window.component';

describe('ManageSongsWindowComponent', () => {
  let component: ManageSongsWindowComponent;
  let fixture: ComponentFixture<ManageSongsWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSongsWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSongsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
