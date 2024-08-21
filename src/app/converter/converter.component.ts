// src/app/converter/converter.component.ts
import { Component, computed, inject, OnInit } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ConversionHistory {
  realRate: number;
  fixedRate: number | null;
  input: number;
  inputCurrency: string;
  output: number;
  outputCurrency: string;
  isFixedRateActive: boolean;
  isFixedRateUsed: boolean;
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConverterComponent implements OnInit {
  private currencyService = inject(CurrencyService);
  private _currencyType: 'EUR' | 'USD' = 'EUR';
  private _lastConvertedAmount: number = 0;

  get currencyType(): 'EUR' | 'USD' {
    return this._currencyType;
  }

  set currencyType(value: 'EUR' | 'USD') {
    if (this._currencyType !== value) {
      this._currencyType = value;
      this.targetCurrency = value === 'EUR' ? 'USD' : 'EUR';
      this.inputAmount = this._lastConvertedAmount;
    }
  }
  public targetCurrency = this.currencyType === 'EUR' ? 'USD' : 'EUR';
  public inputAmount: number = 0;
  public fixedRate: number | null = null;
  public history: ConversionHistory[] = [];

  public convertedAmount = computed(() => {
    const amount = this.inputAmount;
    let rate = this.currencyService.effectiveRate();
    let result = 0;

    if (this.currencyType === 'EUR') {
      result = amount * rate;
    } else {
      result = amount / rate;
    }
    this._lastConvertedAmount = result;
    this.addToHistory(amount, rate, result);
    return result

  });



  public ngOnInit(): void {

  }


  public applyFixedRate() {
    if (this.fixedRate) {
      this.currencyService.setFixedRate(this.fixedRate);
    }
  }

  public clearFixedRate() {
    this.currencyService.clearFixedRate();
  }

  private addToHistory(input: number, usedRate: number, output: number) {
    const fixedRate = this.currencyService.fixedRate();
    const effectiveRate = this.currencyService.effectiveRate();
    const entry: ConversionHistory = {
      realRate: this.currencyService.exchangeRate(),
      fixedRate: fixedRate,
      input: input,
      inputCurrency: this.currencyType,
      output: output,
      outputCurrency: this.targetCurrency,
      isFixedRateActive: fixedRate !== null,
      isFixedRateUsed: fixedRate !== null && effectiveRate === fixedRate
    };

    this.history.unshift(entry);
    if (this.history.length > 5) {
      this.history.pop();
    }
  }
}
