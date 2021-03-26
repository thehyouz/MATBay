import { TestBed } from '@angular/core/testing';

import { GradedConstitutionService } from './graded-constitution.service';

describe('GradedConstitutionService', () => {
  let service: GradedConstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradedConstitutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
