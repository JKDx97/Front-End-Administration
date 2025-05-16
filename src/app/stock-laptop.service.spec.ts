import { TestBed } from '@angular/core/testing';

import { StockLaptopService } from './stock-laptop.service';

describe('StockLaptopService', () => {
  let service: StockLaptopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockLaptopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
