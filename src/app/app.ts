import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from './core/services/layout/layout-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {

  protected readonly title = signal('fixmate');

  constructor(private layout:LayoutService){}

}