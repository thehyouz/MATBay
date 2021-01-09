import { TestBed } from '@angular/core/testing';

import { ConstitutionHistoryManagerService } from './constitution-history-manager.service';

describe('ConstitutionHistoryManagerService', () => {
  let service: ConstitutionHistoryManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstitutionHistoryManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
