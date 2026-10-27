import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root',
})
export class Timer implements OnDestroy {
  private readonly focusDuration = 25 * 60;
  private readonly breakDuration = 5 * 60;
  private intervalId: number | undefined;

  readonly phase = signal<'focus' | 'break'>('focus');
  readonly activeTaskId = signal<string | null>(null);
  readonly activeTask = computed(
    () => this.storage.tasks().find((task) => task.id === this.activeTaskId()) ?? null,
  );
  readonly remainingSeconds = signal(this.focusDuration);
  readonly isRunning = signal(false);

  constructor(readonly storage: Storage) {}

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingSeconds() / 60);
    const seconds = this.remainingSeconds() % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  get focusDurationSeconds(): number {
    return (this.activeTask()?.focusMinutes ?? 25) * 60;
  }

  selectTask(id: string): void {
    if (this.isRunning()) {
      return;
    }

    this.activeTaskId.set(id || null);
    this.reset();
  }

  start(): void {
    if (this.isRunning()) {
      return;
    }

    this.isRunning.set(true);
    this.intervalId = window.setInterval(() => this.tick(), 1000);
  }

  pause(): void {
    this.stopInterval();
    this.isRunning.set(false);
  }

  reset(): void {
    this.pause();
    this.phase.set('focus');
    this.remainingSeconds.set(this.focusDurationSeconds);
  }

  ngOnDestroy(): void {
    this.stopInterval();
  }

  private tick(): void {
    if (this.remainingSeconds() > 1) {
      this.remainingSeconds.update((seconds) => seconds - 1);
      return;
    }

    this.stopInterval();
    this.isRunning.set(false);

    if (this.phase() === 'focus') {
      this.storage.addCompletedSession();
      this.phase.set('break');
      this.remainingSeconds.set(this.breakDuration);
    } else {
      this.phase.set('focus');
      this.remainingSeconds.set(this.focusDurationSeconds);
    }
  }

  private stopInterval(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
