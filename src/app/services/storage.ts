import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly tasksKey = 'focus-app.tasks';
  private readonly sessionsKey = 'focus-app.sessions';
  private readonly themeKey = 'focus-app.dark-mode';

  readonly tasks = signal<Task[]>(
    this.read<Task[]>(this.tasksKey, []).map((task) => ({
      ...task,
      focusMinutes: this.validFocusMinutes(task.focusMinutes) ? task.focusMinutes : 25,
    })),
  );
  readonly sessionsByDay = signal<Record<string, number>>(
    this.read<Record<string, number>>(this.sessionsKey, {}),
  );
  readonly darkMode = signal(this.read<boolean>(this.themeKey, false));

  get todaySessions(): number {
    return this.sessionsByDay()[this.todayKey()] ?? 0;
  }

  addTask(title: string, focusMinutes = 25): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    this.updateTasks([
      ...this.tasks(),
      {
        id: this.createId(),
        title: trimmedTitle,
        completed: false,
        focusMinutes: this.validFocusMinutes(focusMinutes) ? focusMinutes : 25,
      },
    ]);
  }

  updateTaskFocusMinutes(id: string, focusMinutes: number): void {
    if (!this.validFocusMinutes(focusMinutes)) {
      return;
    }

    this.updateTasks(
      this.tasks().map((task) => (task.id === id ? { ...task, focusMinutes } : task)),
    );
  }

  toggleTask(id: string): void {
    this.updateTasks(
      this.tasks().map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  deleteTask(id: string): void {
    this.updateTasks(this.tasks().filter((task) => task.id !== id));
  }

  addCompletedSession(): void {
    const sessions = {
      ...this.sessionsByDay(),
      [this.todayKey()]: this.todaySessions + 1,
    };
    this.sessionsByDay.set(sessions);
    this.write(this.sessionsKey, sessions);
  }

  toggleDarkMode(): void {
    const darkMode = !this.darkMode();
    this.darkMode.set(darkMode);
    this.write(this.themeKey, darkMode);
  }

  private updateTasks(tasks: Task[]): void {
    this.tasks.set(tasks);
    this.write(this.tasksKey, tasks);
  }

  private todayKey(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  }

  private validFocusMinutes(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 180;
  }

  private read<T>(key: string, fallback: T): T {
    const value = localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Unable to read saved app data for "${key}".`, error);
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
