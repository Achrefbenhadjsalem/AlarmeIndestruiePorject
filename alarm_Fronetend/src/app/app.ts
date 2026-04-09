import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListesDesMachines } from './Compoenents/listes-des-machines/listes-des-machines';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListesDesMachines],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'alarm_Fronetend';
}
