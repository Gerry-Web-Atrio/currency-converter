import { Injectable, signal, DestroyRef, inject, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private static readonly BASE_RATE = 1.1;
  private destroyRef = inject(DestroyRef)
  private _exchangeRate = signal(CurrencyService.BASE_RATE);
  public exchangeRate = this._exchangeRate.asReadonly();
  private _fixedRate = signal<number | null>(null);
  public fixedRate = this._fixedRate.asReadonly();

  public effectiveRate = computed(() => {
    const currentRate = this.exchangeRate();
    const fixedRate = this.fixedRate();

    if (fixedRate !== null && Math.abs(fixedRate - currentRate) <= 0.02 * currentRate) {
      return fixedRate;
    }

    return currentRate;
  });

  constructor() {
    this.startPolling();
  }

  private startPolling() {
    interval(3000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      const variation = (Math.random() * 0.1) - 0.05;
      const newRate = CurrencyService.BASE_RATE + variation;
      this._exchangeRate.set(newRate);
    });
  }

  setFixedRate(rate: number) {
    this._fixedRate.set(rate);
  }

  clearFixedRate() {
    this._fixedRate.set(null);
  }
}
