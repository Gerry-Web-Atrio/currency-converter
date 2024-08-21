import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConverterComponent } from './converter.component';
import { CurrencyService } from '../currency.service';

describe('ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule, ConverterComponent ],
      providers: [ CurrencyService ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert EUR to USD', () => {
    component.inputAmount = 100;
    component.currencyType = 'EUR';
    tick(3000);
    expect(component.convertedAmount()).toBeCloseTo(110, 2);
  });

  it('should convert USD to EUR', () => {
    component.inputAmount = 110;
    component.currencyType = 'USD';
    tick(3000);
    expect(component.convertedAmount()).toBeCloseTo(100, 2);
  });

  it('should switch currencies', () => {
    component.inputAmount = 100;
    component.currencyType = 'EUR';
    const initialConvertedAmount = component.convertedAmount();
    component.currencyType = 'USD';
    expect(component.targetCurrency).toBe('EUR');
    expect(component.inputAmount).toBeCloseTo(initialConvertedAmount, 2);
  });

  it('should update conversion on exchange rate change', fakeAsync(() => {
    component.inputAmount = 100;
    component.currencyType = 'EUR';
    const initialConvertedAmount = component.convertedAmount;
    tick(3000);
    expect(component.convertedAmount).not.toBe(initialConvertedAmount);
  }));

  it('should add conversion to history', () => {
    component.inputAmount = 100;
    component.currencyType = 'EUR';
    expect(component.history.length).toBe(1);
    expect(component.history[0].input).toBe(100);
    expect(component.history[0].inputCurrency).toBe('EUR');
  });

  it('should maintain only last 5 conversions in history', () => {
    for (let i = 0; i < 6; i++) {
      component.inputAmount = 100 + i;
    }
    expect(component.history.length).toBe(5);
    expect(component.history[0].input).toBe(101);
  });

  it('should allow setting a fixed exchange rate', () => {
    component.fixedRate = 1.2;
    component.applyFixedRate();
    expect(currencyService.fixedRate()).toBe(1.2);
  });

  it('should use real rate when fixed rate variation exceeds 2%', fakeAsync(() => {
    component.fixedRate = 1.2;
    component.applyFixedRate();
    expect(currencyService.effectiveRate()).not.toBe(1.2);
  }));
});
