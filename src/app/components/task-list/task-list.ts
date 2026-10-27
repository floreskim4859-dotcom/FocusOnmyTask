import { Component, computed, inject, signal } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { Storage } from '../../services/storage';
import { Timer as TimerService } from '../../services/timer';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  readonly storage = inject(Storage);
  readonly timer = inject(TimerService);
  readonly taskTitle = signal('');
  readonly newTaskFocusMinutes = signal(25);
  readonly taskCount = computed(() => this.storage.tasks().length);
  readonly remainingCount = computed(
    () => this.storage.tasks().filter((task) => !task.completed).length,
  );
  readonly completedCount = computed(
    () => this.storage.tasks().filter((task) => task.completed).length,
  );
  readonly remainingFocusMinutes = computed(() =>
    this.storage
      .tasks()
      .filter((task) => !task.completed)
      .reduce((total, task) => total + task.focusMinutes, 0),
  );

  addTask(event: SubmitEvent): void {
    event.preventDefault();
    this.storage.addTask(this.taskTitle(), this.newTaskFocusMinutes());
    this.taskTitle.set('');
    this.newTaskFocusMinutes.set(25);
  }

  updateTaskTitle(event: Event): void {
    this.taskTitle.set((event.target as HTMLInputElement).value);
  }

  updateNewTaskFocusMinutes(event: Event): void {
    const input = event.target as HTMLInputElement;
    const focusMinutes = input.valueAsNumber;
    if (Number.isInteger(focusMinutes) && focusMinutes >= 1 && focusMinutes <= 180) {
      this.newTaskFocusMinutes.set(focusMinutes);
    } else {
      input.value = String(this.newTaskFocusMinutes());
    }
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes} min`;
    }
    return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
  }

  updateFocusMinutes(id: string, focusMinutes: number): void {
    this.storage.updateTaskFocusMinutes(id, focusMinutes);
    if (this.timer.activeTask()?.id === id && !this.timer.isRunning()) {
      this.timer.reset();
    }
  }

  deleteTask(id: string): void {
    const isActiveTask = this.timer.activeTask()?.id === id;
    this.storage.deleteTask(id);
    if (isActiveTask && !this.timer.isRunning()) {
      this.timer.reset();
    }
  }
}
