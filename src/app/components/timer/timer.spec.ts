import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Timer } from './timer';

describe('Timer', () => {
  let component: Timer;
  let fixture: ComponentFixture<Timer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timer],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
