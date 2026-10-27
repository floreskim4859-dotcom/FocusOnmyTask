import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Storage } from './storage';

describe('Storage', () => {
  let service: Storage;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(Storage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saves tasks and restores them from local storage', () => {
    service.addTask('Write tests');
    const task = service.tasks()[0];

    service.toggleTask(task.id);

    expect(JSON.parse(localStorage.getItem('focus-app.tasks') ?? '[]')).toEqual([
      { ...task, completed: true },
    ]);
  });

  it('saves a custom focus duration for each task', () => {
    service.addTask('Short task', 15);
    service.addTask('Long task', 45);

    expect(service.tasks().map((task) => task.focusMinutes)).toEqual([15, 45]);
    service.updateTaskFocusMinutes(service.tasks()[0].id, 20);
    expect(service.tasks()[0].focusMinutes).toBe(20);
  });

  it('counts completed sessions for today and persists them', () => {
    service.addCompletedSession();
    service.addCompletedSession();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    expect(service.todaySessions).toBe(2);
    expect(JSON.parse(localStorage.getItem('focus-app.sessions') ?? '{}')).toEqual({
      [todayKey]: 2,
    });
  });

  it('persists the selected theme', () => {
    service.toggleDarkMode();

    expect(service.darkMode()).toBeTrue();
    expect(localStorage.getItem('focus-app.dark-mode')).toBe('true');
  });

  it('restores tasks, session totals, and theme from local storage', () => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    localStorage.setItem(
      'focus-app.tasks',
      JSON.stringify([{ id: 'saved-task', title: 'Saved task', completed: true }]),
    );
    localStorage.setItem('focus-app.sessions', JSON.stringify({ [todayKey]: 3 }));
    localStorage.setItem('focus-app.dark-mode', 'true');

    const restored = new Storage();

    expect(restored.tasks()).toEqual([
      { id: 'saved-task', title: 'Saved task', completed: true, focusMinutes: 25 },
    ]);
    expect(restored.todaySessions).toBe(3);
    expect(restored.darkMode()).toBeTrue();
  });
});
