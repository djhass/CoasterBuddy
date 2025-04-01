import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
