import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsolasComponent } from './stock-consolas.component';

describe('StockConsolasComponent', () => {
  let component: StockConsolasComponent;
  let fixture: ComponentFixture<StockConsolasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockConsolasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockConsolasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
