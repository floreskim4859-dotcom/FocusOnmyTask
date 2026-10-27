import { Component, inject } from '@angular/core';
import { Timer as TimerService } from '../../services/timer';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  readonly timer = inject(TimerService);

  updateSelectedTask(event: Event): void {
    this.timer.selectTask((event.target as HTMLSelectElement).value);
  }
}
