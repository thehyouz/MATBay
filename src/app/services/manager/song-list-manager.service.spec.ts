import { TestBed } from '@angular/core/testing';

import { SongListManagerService } from './song-list-manager.service';

describe('SongListManagerService', () => {
  let service: SongListManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongListManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
