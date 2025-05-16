import { TestBed } from '@angular/core/testing';

import { ConsolasService } from './consolas.service';

describe('ConsolasService', () => {
  let service: ConsolasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
