import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Storage } from './services/storage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  host: {
    '[class.dark-theme]': 'storage.darkMode()',
  },
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly storage = inject(Storage);
}
