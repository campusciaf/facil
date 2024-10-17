import { TestBed } from '@angular/core/testing';

import { ConectarApiService } from './conectar-api.service';

describe('ConectarApiService', () => {
  let service: ConectarApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectarApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
