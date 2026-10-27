import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { TaskItem } from './task-item';

describe('TaskItem', () => {
  let component: TaskItem;
  let fixture: ComponentFixture<TaskItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'Focus',
      completed: false,
      focusMinutes: 25,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
