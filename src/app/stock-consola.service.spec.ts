import { TestBed } from '@angular/core/testing';

import { StockConsolaService } from './stock-consola.service';

describe('StockConsolaService', () => {
  let service: StockConsolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockConsolaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
