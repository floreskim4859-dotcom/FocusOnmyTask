import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Timer } from './timer';
import { Storage } from './storage';

describe('Timer', () => {
  let service: Timer;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(Timer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts at 25 minutes and pauses without resetting the time', () => {
    expect(service.formattedTime).toBe('25:00');

    jasmine.clock().install();
    try {
      service.start();
      jasmine.clock().tick(2000);
      service.pause();
      expect(service.formattedTime).toBe('24:58');
      expect(service.isRunning()).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('uses the selected task duration and keeps breaks at five minutes', () => {
    const storage = TestBed.inject(Storage);
    storage.addTask('Deep work', 45);
    const task = storage.tasks()[0];

    service.selectTask(task.id);
    expect(service.formattedTime).toBe('45:00');

    jasmine.clock().install();
    try {
      service.start();
      jasmine.clock().tick(45 * 60 * 1000);

      expect(service.phase()).toBe('break');
      expect(service.formattedTime).toBe('05:00');
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('records a completed focus session and switches to a break', () => {
    jasmine.clock().install();
    try {
      service.start();
      jasmine.clock().tick(25 * 60 * 1000);

      expect(service.phase()).toBe('break');
      expect(service.formattedTime).toBe('05:00');
      expect(TestBed.inject(Storage).todaySessions).toBe(1);
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
