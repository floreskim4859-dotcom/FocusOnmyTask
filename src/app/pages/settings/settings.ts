import { Component, inject } from '@angular/core';

import { Storage } from '../../services/storage';
@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  readonly storage = inject(Storage);
}
