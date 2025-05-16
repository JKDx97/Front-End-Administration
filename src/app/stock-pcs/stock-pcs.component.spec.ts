import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPcsComponent } from './stock-pcs.component';

describe('StockPcsComponent', () => {
  let component: StockPcsComponent;
  let fixture: ComponentFixture<StockPcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockPcsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
