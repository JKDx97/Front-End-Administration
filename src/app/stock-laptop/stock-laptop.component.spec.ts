import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLaptopComponent } from './stock-laptop.component';

describe('StockLaptopComponent', () => {
  let component: StockLaptopComponent;
  let fixture: ComponentFixture<StockLaptopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLaptopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockLaptopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
