import { TestBed } from '@angular/core/testing';

import { ConstitutionManagerService } from './constitution-manager.service';

describe('ConstitutionManagerService', () => {
  let service: ConstitutionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstitutionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
