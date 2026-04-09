import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopupAlarmeDetected } from './Compoenents/popup-alarme-detected/popup-alarme-detected';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, PopupAlarmeDetected],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = '2CM Monitoring System';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationError) console.error('❌ NavigationError:', event.error);
      if (event instanceof NavigationCancel) console.warn('⚠️ NavigationCancel:', event.reason);
    });
  }
}
