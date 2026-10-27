import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows clocks for GMT, PHT, SGT, Eastern, and Pacific time', () => {
    expect(component.clocks().map((clock) => clock.zone)).toEqual([
      'GMT',
      'PHT',
      'SGT',
      'ET',
      'PT',
    ]);
    expect(fixture.nativeElement.textContent).toContain('Manila');
    expect(fixture.nativeElement.textContent).toContain('Los Angeles');
  });
});
