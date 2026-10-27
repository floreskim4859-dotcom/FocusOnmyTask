import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-item',
  imports: [],
  host: {
    role: 'listitem',
  },
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly durationDisabled = input(false);
  readonly toggled = output<void>();
  readonly deleted = output<void>();
  readonly focusMinutesChanged = output<number>();

  updateFocusMinutes(event: Event): void {
    const input = event.target as HTMLInputElement;
    const focusMinutes = input.valueAsNumber;
    if (Number.isInteger(focusMinutes) && focusMinutes >= 1 && focusMinutes <= 180) {
      this.focusMinutesChanged.emit(focusMinutes);
    } else {
      input.value = String(this.task().focusMinutes);
    }
  }
}
