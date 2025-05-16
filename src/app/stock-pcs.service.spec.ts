import { TestBed } from '@angular/core/testing';

import { StockPcsService } from './stock-pcs.service';

describe('StockPcsService', () => {
  let service: StockPcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockPcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
