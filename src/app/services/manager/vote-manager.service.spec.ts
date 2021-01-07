import { TestBed } from '@angular/core/testing';

import { VoteManagerService } from './vote-manager.service';

describe('VoteManagerService', () => {
  let service: VoteManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
