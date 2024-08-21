import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'currency-converter';
}
