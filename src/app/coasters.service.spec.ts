import { TestBed } from '@angular/core/testing';

import { CoastersService } from './coasters.service';

describe('CoastersService', () => {
  let service: CoastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
