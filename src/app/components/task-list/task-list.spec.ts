import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { TaskList } from './task-list';
import { Storage } from '../../services/storage';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('summarizes remaining task count and planned focus time', () => {
    const storage = TestBed.inject(Storage);
    storage.addTask('First task', 10);
    storage.addTask('Second task', 5);
    storage.addTask('Completed task', 20);
    storage.toggleTask(storage.tasks()[2].id);
    fixture.detectChanges();

    expect(component.taskCount()).toBe(3);
    expect(component.remainingFocusMinutes()).toBe(15);
    expect(fixture.nativeElement.textContent).toContain('15 min planned for 2 remaining');
  });
});
