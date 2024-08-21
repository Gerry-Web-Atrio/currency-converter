import { Injectable, signal, DestroyRef, inject, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private destroyRef = inject(DestroyRef)
  private _exchangeRate = signal(1.1);
  public exchangeRate = this._exchangeRate.asReadonly();
  private _fixedRate = signal<number | null>(null);
  public fixedRate = this._fixedRate.asReadonly();

  public effectiveRate = computed(() => {
    const currentRate = this._exchangeRate();
    const fixedRate = this._fixedRate();

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
      this._exchangeRate.update(currentRate => currentRate + variation);
    });
  }

  setFixedRate(rate: number) {
    this._fixedRate.set(rate);
  }

  clearFixedRate() {
    this._fixedRate.set(null);
  }
}
