import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Storage } from '../../services/storage';

const clockZones = [
  { city: 'UTC', zone: 'GMT', timeZone: 'Etc/UTC' },
  { city: 'Manila', zone: 'PHT', timeZone: 'Asia/Manila' },
  { city: 'Singapore', zone: 'SGT', timeZone: 'Asia/Singapore' },
  { city: 'New York', zone: 'ET', timeZone: 'America/New_York' },
  { city: 'Los Angeles', zone: 'PT', timeZone: 'America/Los_Angeles' },
] as const;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  readonly storage = inject(Storage);
  private readonly currentTime = signal(Date.now());
  private readonly clockInterval = globalThis.setInterval(() => {
    this.currentTime.set(Date.now());
  }, 15_000);
  readonly clocks = computed(() => {
    const now = new Date(this.currentTime());
    return clockZones.map(({ city, zone, timeZone }) => ({
      city,
      zone,
      time: new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(now),
    }));
  });

  ngOnDestroy(): void {
    globalThis.clearInterval(this.clockInterval);
  }
}
