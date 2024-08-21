import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with exchange rate of 1.1', () => {
    expect(service.exchangeRate()).toBe(1.1);
  });

  it('should update exchange rate every 3 seconds', fakeAsync(() => {
    const initialRate = service.exchangeRate();
    tick(3000);
    expect(service.exchangeRate()).not.toBe(initialRate);
  }));

  it('should update exchange rate within -0.05 and +0.05 range', fakeAsync(() => {
    const initialRate = service.exchangeRate();
    tick(3000);
    const newRate = service.exchangeRate();
    expect(Math.abs(newRate - initialRate)).toBeLessThanOrEqual(0.05);
  }));

  it('should allow setting a fixed exchange rate', () => {
    service.setFixedRate(1.2);
    expect(service.fixedRate()).toBe(1.2);
  });

  it('should disable fixed rate when variation exceeds 2%', fakeAsync(() => {
    service.setFixedRate(1.13);
    expect(service.effectiveRate()).toBe(service.exchangeRate());
  }));
});
