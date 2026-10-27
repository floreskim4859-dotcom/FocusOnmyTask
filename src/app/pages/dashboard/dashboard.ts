import { Component } from '@angular/core';
import { TaskList } from '../../components/task-list/task-list';
import { Timer } from '../../components/timer/timer';

@Component({
  selector: 'app-dashboard',
  imports: [Timer, TaskList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
}
